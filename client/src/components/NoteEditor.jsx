import React, { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash.debounce';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Spinner, Alert, Badge } from 'react-bootstrap';
import api from '../api';

/* escape text before injecting into HTML */
const esc = s =>
  s.replace(/[&<>"']/g, ch =>
    ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;' }[ch])
  );

export default function NoteEditor({ noteId: propId, onNoteChange }) {
  const { id: urlId } = useParams();
  const noteId  = propId ?? urlId;
  const navigate = useNavigate();

  const [title, setTitle]     = useState('');
  const [content, setContent] = useState('');
  const [corrections, setCor] = useState({});
  const [saving, setSaving]   = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [loading, setLoading] = useState(Boolean(noteId));

  /* ── load existing note ── */
  useEffect(() => {
    if (!noteId) return;
    (async () => {
      try {
        const { data } = await api.get(`/notes/${noteId}`);
        setTitle(data.title);
        setContent(data.content);
      } catch (err) {
        console.error(err);
        navigate('/');
      } finally {
        setLoading(false);
      }
    })();
  }, [noteId, navigate]);

  /* ── debounced fact-check ── */
  const check = useCallback(
    debounce(async sentence => {
      try {
        const { data } = await api.post('/factcheck', { sentence });
        if (data.corrections?.length) {
          setCor(p => ({ ...p, [sentence]: data.corrections }));
        }
      } catch (err) { console.error(err); }
    }, 3000),
    []
  );

  const onContent = e => {
    const txt = e.target.value;
    setContent(txt);
    const parts = txt.match(/[^.!?]+[.!?]/g);
    if (parts?.length) {
      const last = parts.at(-1).trim();
      if (last && !corrections[last]) check(last);
    }
  };

  /* ── save note ── */
  const save = async () => {
    if (!title.trim() && !content.trim()) {
      setSaveMsg('Nothing to save');
      return;
    }
    setSaving(true);
    try {
      const body = { title, content };
      if (noteId) {
        await api.put(`/notes/${noteId}`, body);
      } else {
        const { data } = await api.post('/notes', body);
        onNoteChange?.(data._id);
        navigate(`/notes/${data._id}`);
      }
      setSaveMsg('Saved!');
    } catch (err) {
      console.error(err);
      setSaveMsg('Save failed');
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMsg(''), 2500);
    }
  };

  /* ── build preview ── */
  const preview = () => {
    if (!content) return '';
    let html = esc(content);
    Object.keys(corrections).forEach(raw => {
      const trimmed  = raw.trimEnd();
      const trailing = raw.slice(trimmed.length);
      const { suggestion, explanation } = corrections[raw][0];
      const tip = `${suggestion}\n\n${explanation}`.replace(/"/g,'&quot;');

      const span =
        `<span class="fact-error" data-bs-toggle="tooltip"
               title="${tip}"
               style="text-decoration:underline wavy #dc3545;
                      text-underline-offset:2px; cursor:pointer;">`
        + esc(trimmed) + '</span>' + esc(trailing);

      html = html.replace(esc(raw), span);
    });
    return html;
  };

  /* re-init Bootstrap tooltips whenever highlights change */
  useEffect(() => {
    const t = setTimeout(() => {
      if (!window.bootstrap) return;
      document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => {
        window.bootstrap.Tooltip.getInstance(el)?.dispose();
        new window.bootstrap.Tooltip(el);
      });
    }, 100);
    return () => clearTimeout(t);
  }, [corrections]);

  // ✱ Auto-remove corrections once the user deletes the sentence
  useEffect(() => {
    setCor(prev => {
      const fresh = { ...prev };
      Object.keys(fresh).forEach(sentence => {
        if (!content.includes(sentence)) delete fresh[sentence];
      });
      return fresh;
    });
  }, [content]);


  /* ── UI ── */
  if (loading)
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
        <p className="mt-2 text-muted">Loading…</p>
      </div>
    );

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center mb-3">
        <Button onClick={save} disabled={saving}>
          {saving ? <Spinner size="sm" /> : 'Save'}
        </Button>
        {saveMsg && <span className="ms-3 text-muted">{saveMsg}</span>}
      </div>

      <input
        className="form-control form-control-lg mb-3 fw-bold"
        placeholder="Note title…"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

      <textarea
        className="form-control mb-3"
        rows={8}
        placeholder="Write here. End sentences with '.', '?', or '!' to trigger fact-check."
        value={content}
        onChange={onContent}
      />

      <div className="border rounded p-3 bg-light">
        <h6 className="text-muted mb-2">Preview with fact-check:</h6>
        <div style={{ whiteSpace:'pre-wrap' }}
             dangerouslySetInnerHTML={{ __html: preview() || '<em>No content yet…</em>' }} />
      </div>

      {!!Object.keys(corrections).length && (
        <Alert variant="warning" className="mt-3">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {Object.keys(corrections).length} sentence
          {Object.keys(corrections).length > 1 ? 's were' : ' was'} flagged.
          Hover the <Badge bg="secondary">red-underlined</Badge> text to view fixes.
        </Alert>
      )}
    </div>
  );
}
