"use client";
import React, { useMemo, useState } from 'react';
import { predictFromParagraph, predictFromFields } from '../services/api.js';

const defaultFields = {
  title: '',
  company_profile: '',
  description: '',
  requirements: '',
  benefits: '',
  salary_range: '',
  remote: 'unknown',
  has_company_website: 'unknown'
};

export default function JobDetector() {
  const [mode, setMode] = useState('paragraph'); // 'paragraph' | 'structured'
  const [paragraph, setParagraph] = useState('');
  const [fields, setFields] = useState(defaultFields);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // {label, confidence, details?}
  const [error, setError] = useState('');

  const canSubmit = useMemo(() => {
    if (mode === 'paragraph') return paragraph.trim().length > 10;
    const minFields = [fields.title, fields.description];
    return minFields.every(v => (v || '').trim().length > 3);
  }, [mode, paragraph, fields]);

  const onChangeField = (key, value) => {
    setFields(prev => ({ ...prev, [key]: value }));
  };

  const reset = () => {
    setResult(null);
    setError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!canSubmit) return;
    reset();
    setLoading(true);
    try {
      let data;
      if (mode === 'paragraph') {
        data = await predictFromParagraph(paragraph.trim());
      } else {
        const payload = {
          title: fields.title.trim(),
          company_profile: fields.company_profile.trim(),
          description: fields.description.trim(),
          requirements: fields.requirements.trim(),
          benefits: fields.benefits.trim(),
          salary_range: fields.salary_range.trim(),
          remote:
            fields.remote === 'true' ? true : fields.remote === 'false' ? false : null,
          has_company_website:
            fields.has_company_website === 'true'
              ? true
              : fields.has_company_website === 'false'
              ? false
              : null
        };
        data = await predictFromFields(payload);
      }
      setResult(data);
    } catch (err) {
      setError(err?.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card">
      <div className="tabs">
        <button
          className={mode === 'paragraph' ? 'tab active' : 'tab'}
          onClick={() => {
            setMode('paragraph');
            reset();
          }}
        >
          Paragraph Input
        </button>
        <button
          className={mode === 'structured' ? 'tab active' : 'tab'}
          onClick={() => {
            setMode('structured');
            reset();
          }}
        >
          Structured Fields
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {mode === 'paragraph' ? (
          <div className="field">
            <label>Full Job Details (Paragraph)</label>
            <textarea
              rows={10}
              placeholder="Paste the full job description here..."
              value={paragraph}
              onChange={e => setParagraph(e.target.value)}
            />
            <small>Enter at least a few sentences for best results.</small>
          </div>
        ) : (
          <>
            <div className="grid">
              <div className="field">
                <label>Title</label>
                <input
                  type="text"
                  placeholder="e.g., Software Engineer Intern"
                  value={fields.title}
                  onChange={e => onChangeField('title', e.target.value)}
                />
              </div>
              <div className="field">
                <label>Salary Range</label>
                <input
                  type="text"
                  placeholder="e.g., $1000-$1500/month"
                  value={fields.salary_range}
                  onChange={e => onChangeField('salary_range', e.target.value)}
                />
              </div>
            </div>

            <div className="field">
              <label>Company Profile</label>
              <textarea
                rows={3}
                placeholder="Brief about the company..."
                value={fields.company_profile}
                onChange={e => onChangeField('company_profile', e.target.value)}
              />
            </div>

            <div className="field">
              <label>Description</label>
              <textarea
                rows={5}
                placeholder="Role description and responsibilities..."
                value={fields.description}
                onChange={e => onChangeField('description', e.target.value)}
              />
            </div>

            <div className="field">
              <label>Requirements</label>
              <textarea
                rows={4}
                placeholder="Skills and qualifications..."
                value={fields.requirements}
                onChange={e => onChangeField('requirements', e.target.value)}
              />
            </div>

            <div className="field">
              <label>Benefits</label>
              <textarea
                rows={3}
                placeholder="Perks and benefits..."
                value={fields.benefits}
                onChange={e => onChangeField('benefits', e.target.value)}
              />
            </div>

            <div className="grid">
              <div className="field">
                <label>Remote</label>
                <select
                  value={fields.remote}
                  onChange={e => onChangeField('remote', e.target.value)}
                >
                  <option value="unknown">Unknown</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div className="field">
                <label>Has Company Website</label>
                <select
                  value={fields.has_company_website}
                  onChange={e => onChangeField('has_company_website', e.target.value)}
                >
                  <option value="unknown">Unknown</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
            </div>
          </>
        )}

        <div className="actions">
          <button type="submit" disabled={!canSubmit || loading}>
            {loading ? 'Analyzing…' : 'Detect Fraudulence'}
          </button>
          <button
            type="button"
            className="secondary"
            onClick={() => {
              setParagraph('');
              setFields(defaultFields);
              reset();
            }}
          >
            Reset
          </button>
        </div>
      </form>

      {error && <div className="error">Error: {error}</div>}

      {result && (
        <div className="result">
          <h3>Prediction</h3>
          <div className={`pill ${result?.label?.toLowerCase() === 'fraud' ? 'danger' : 'safe'}`}>
            {result?.label || 'Unknown'}
          </div>
          {typeof result?.confidence === 'number' && (
            <p>Confidence: {(result.confidence * 100).toFixed(1)}%</p>
          )}
          {result?.details && (
            <details>
              <summary>Details</summary>
              <pre>{JSON.stringify(result.details, null, 2)}</pre>
            </details>
          )}
        </div>
      )}
    </section>
  );
}
