import Sidebar from '../components/Sidebar.jsx'

const FORMULA_STYLE = {
  fontFamily: 'monospace',
  padding: '0.5rem 1rem',
  background: 'var(--surface2)',
  borderRadius: '4px',
}

export default function ArticleEeg({ onNavigate }) {
  return (
    <div className="page-wrap active">
      <div className="page-inner">
        <div className="content-area">
          <div className="breadcrumb">
            <span>~ / </span>
            <a
              className="nav-link"
              href="#archive"
              onClick={e => {
                e.preventDefault()
                onNavigate('archive')
              }}
            >archive</a>
            <span> / </span>Total Perspective Vortex
          </div>
          <div className="tags">
            <span className="tag"><span className="tag-label">tag</span><span className="tag-value">eeg</span></span>
            <span className="tag"><span className="tag-label">tag</span><span className="tag-value">ml</span></span>
            <span className="tag"><span className="tag-label">tag</span><span className="tag-value">python</span></span>
            <span className="tag"><span className="tag-label">tag</span><span className="tag-value">bci</span></span>
          </div>
          <h1 className="article-title">Total Perspective Vortex: classifying motor imagery EEG with CSP + LDA</h1>
          <p className="article-meta">Posted on May 14, 2026 · 15 min read · by mylastresort</p>
          <div className="callout">
            Dataset: <strong>PhysioNet EEGMMI</strong> — 109 subjects, 64 channels, 160 Hz. Target: ≥ 60% mean accuracy
            across subjects using a classical signal-processing pipeline. Full exploration notebook:
            <a href="https://github.com/mylastresort/total-perspective-vortex/blob/master/src/physionet.ipynb" target="_blank">src/physionet.ipynb</a>.
          </div>
          <div className="article-body">
            <h2><span className="hash">#</span> Overview</h2>
            <p>Starting from raw EDF files downloaded off PhysioNet, the pipeline cleans 64-channel EEG recordings
              from 109 subjects, segments them into 5-second motor imagery trials, projects them through Common
              Spatial Pattern filters that isolate motor cortex activity, and feeds the resulting features to a
              Linear Discriminant classifier — reaching 67.3% mean accuracy across subjects on the hands vs feet
              task, clearing the 60% project threshold. No deep learning, no pre-trained weights. Just covariance
              matrices, spatial filters, and a linear boundary.</p>

            <h2><span className="hash">#</span> Dataset &amp; Experiments</h2>
            <p>PhysioNet's EEG Motor Movement/Imagery (EEGMMI) dataset contains 109 subjects performing six distinct
              motor tasks. Each task maps to a set of EDF run files:</p>
            <table>
              <thead><tr><th>Experiment</th><th>Runs</th></tr></thead>
              <tbody>
                <tr><td>Motor execution: left vs right hand</td><td>[3, 7, 11]</td></tr>
                <tr><td>Motor imagery: left vs right hand</td><td>[4, 8, 12]</td></tr>
                <tr><td>Motor execution: hands vs feet</td><td>[5, 9, 13]</td></tr>
                <tr><td>Motor imagery: hands vs feet</td><td>[6, 10, 14]</td></tr>
                <tr><td>Motor execution: combined</td><td>[3, 7, 11, 5, 9, 13]</td></tr>
                <tr><td>Motor imagery: combined</td><td>[4, 8, 12, 6, 10, 14]</td></tr>
              </tbody>
            </table>
            <p>The primary target is the <strong>Motor imagery: hands vs feet</strong> task (runs 6, 10, 14). Each
              subject's three run files are loaded, concatenated into a single continuous Raw object, and processed
              identically. Data are cached under <code>./data</code>.</p>

            <h2><span className="hash">#</span> Preprocessing pipeline</h2>
            <p>The preprocessing chain executes six deterministic steps before any ML code runs:</p>
            <p><strong>1. Channel standardisation.</strong> PhysioNet ships with malformed channel names like
              <code>Fc4.</code> and <code>T7.</code>. These are renamed in-place to proper 10-20 labels (<code>FC4</code>,
              <code>T7</code>) before any spatial operation — montage lookup fails otherwise.</p>
            <p><strong>2. Montage attachment.</strong> The 10-05 electrode layout is applied, attaching 3D Cartesian
              coordinates to each channel. This is required for topographic plots and source-level analysis later.</p>
            <p><strong>3. Annotation renaming.</strong> PhysioNet encodes events as opaque <code>T1</code>/<code>T2</code>
              markers in the EDF annotations. These are mapped to human-readable labels
              (<code>T1 → "hands"</code>, <code>T2 → "feet"</code>) so downstream code can reference classes by name.</p>
            <p><strong>4. Band-pass filtering.</strong> A causal FIR filter retains only the
              <strong>Alpha (8–13 Hz)</strong> and <strong>Beta (13–30 Hz)</strong> bands — the frequency ranges where
              motor imagery modulates cortical oscillations via event-related desynchronisation (ERD). Slow drifts below
              7 Hz and high-frequency muscle artefacts above 30 Hz are discarded.</p>
            <p><strong>5. Channel selection.</strong> <code>pick_types(meg=False, eeg=True, stim=False, eog=False,
              exclude="bads")</code> retains pure EEG channels and drops the stimulus track and EOG channels. Without
              this, the stimulus square wave and eye-movement artefacts contaminate the covariance matrices and corrupt
              CSP spatial filters.</p>
            <p><strong>6. Epoching.</strong> The continuous signal is segmented into fixed-length trials time-locked to
              each event. The epoch window is <strong>−1 s to +4 s</strong> relative to the cue onset — one second of
              pre-stimulus baseline followed by four seconds of full motor imagery. This yields an
              <code>(n_trials, n_channels, n_times)</code> tensor ready for the scikit-learn pipeline. A deep copy is
              kept for the sliding-window evaluation while the training slice crops to the active motor period.</p>

            <h2><span className="hash">#</span> Common Spatial Patterns</h2>
            <p>CSP finds spatial filters <strong>W</strong> that simultaneously diagonalise the two class covariance
              matrices. Formally it solves the generalised eigenvalue problem:</p>
            <p style={FORMULA_STYLE}>
              Σ₁ w = λ Σ₂ w
            </p>
            <p>The filters maximise the variance ratio between classes. With <code>n_components = 4</code> (2 extreme
              filters per class), each epoch is projected to a four-dimensional feature vector of log-band-power values.
              The resulting components are interpretable: the top-ranked filter loads heavily on contralateral motor
              cortex electrodes and is directly visible as a lateralised scalp topography.</p>

            <h2><span className="hash">#</span> Scikit-learn pipeline</h2>
            <p>CSP and LDA are chained into a single <code>Pipeline([("CSP", csp), ("LDA", lda)])</code> estimator.
              During <code>fit</code>, CSP learns spatial filters from class covariance matrices, transforms the epochs
              to log-variance features, and LDA learns the separating hyperplane in that four-dimensional space. During
              <code>predict</code>, the same learned filters and boundary are applied in order. Wrapping both steps in a
              Pipeline guarantees <strong>no data leakage</strong> across cross-validation folds — CSP never sees
              test-fold data during fitting.</p>

            <h2><span className="hash">#</span> Cross-validation strategy</h2>
            <p><strong>Monte-Carlo (ShuffleSplit)</strong> cross-validation is used instead of k-fold: 10 independent
              random 80/20 splits, each with <code>random_state=42</code> for reproducibility. With EEG data — typically
              few trials and high noise — overlapping splits give a more stable accuracy estimate than a single
              train/test split or strict k-fold. <code>cross_val_score</code> runs the full Pipeline over all 10 folds
              automatically, appending per-fold accuracy before the final test-set evaluation.</p>

            <h2><span className="hash">#</span> Results</h2>
            <p>Mean cross-validated accuracy across 109 subjects: <strong>67.3%</strong> for left vs. right hand
              imagery using 4 CSP components + LDA. Subject-level variance is high (range: 51%–84%), reflecting genuine
              neurophysiological differences — not model error. The pipeline is evaluated across all six experiment
              types via <code>evaluate_experiments()</code>, which loops every subject and task, fitting the same
              Pipeline and aggregating scores into a summary DataFrame.</p>

            <h2><span className="hash">#</span> Notebook</h2>
            <p>The full exploration — including raw vs filtered signal visualisations, epoch shape inspection, per-fold
              score printouts, and the complete experiment sweep — is available in the annotated Jupyter notebook:
              <a href="https://github.com/mylastresort/total-perspective-vortex/blob/master/src/physionet.ipynb"
                 target="_blank">src/physionet.ipynb</a>.</p>
          </div>
        </div>
        <Sidebar />
      </div>
    </div>
  )
}