import React, { useState, useEffect } from 'react';
import {
  Row, Col, Card, Button, Form, InputGroup,
  Badge, Dropdown, Alert, Spinner
} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useNotes } from '../hooks/useNotes';
import { formatDate, truncateText, countWords } from '../utils/helpers';

const NotesList = () => {
  const navigate = useNavigate();

  /* destructure with SAFE defaults */
  const {
    notes = [],
    loading = false,
    fetchNotes,
    deleteNote,
    pagination = { total: 0, page: 1, pages: 1, hasPrev: false, hasNext: false }
  } = useNotes();

  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('updatedAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);

  /* fetch whenever filters change */
  useEffect(() => {
    fetchNotes({
      search,
      sortBy,
      sortOrder,
      page: currentPage,
      limit: 12
    });
  }, [search, sortBy, sortOrder, currentPage, fetchNotes]);

  /* -------- handlers -------- */
  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Delete “${title}” ?`)) await deleteNote(id);
  };

  const sortIcon = (field) =>
    sortBy !== field ? 'bi-arrow-down-up'
    : sortOrder === 'desc' ? 'bi-sort-down' : 'bi-sort-up';

  /* -------- loading spinner (first page) -------- */
  if (loading && notes.length === 0) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2 text-muted">Loading your notes…</p>
      </div>
    );
  }

  /* -------- UI -------- */
  return (
    <div>

      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="h4 mb-1">
                <i className="bi bi-journal-text text-primary me-2"></i>
                My Notes
              </h2>
              <p className="text-muted mb-0">
                {pagination.total} {pagination.total === 1 ? 'note' : 'notes'} total
              </p>
            </div>
            <Button variant="primary" size="sm" onClick={() => navigate('/notes/new')}>
              <i className="bi bi-plus-circle me-2"></i> New Note
            </Button>
          </div>
        </Col>
      </Row>

      {/* Search + sort */}
      <Row className="mb-4">
        <Col md={8}>
          <InputGroup>
            <InputGroup.Text><i className="bi bi-search" /></InputGroup.Text>
            <Form.Control
              placeholder="Search notes…"
              value={search}
              onChange={handleSearch}
            />
            {search && (
              <Button variant="outline-secondary" onClick={() => setSearch('')}>
                <i className="bi bi-x" />
              </Button>
            )}
          </InputGroup>
        </Col>
        <Col md={4}>
          <Dropdown>
            <Dropdown.Toggle variant="outline-secondary" className="w-100">
              <i className={`bi ${sortIcon(sortBy)} me-2`} />
              Sort by {sortBy === 'updatedAt' ? 'Modified' : sortBy === 'createdAt' ? 'Created' : 'Title'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {['updatedAt', 'title', 'createdAt'].map(field => (
                <Dropdown.Item key={field} onClick={() => handleSort(field)}>
                  <i className={`bi ${sortIcon(field)} me-2`} />
                  {field === 'updatedAt' ? 'Last Modified' : field === 'createdAt' ? 'Created Date' : 'Title'}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>

      {/* Empty-state */}
      {notes.length === 0 ? (
        <Alert variant="info" className="text-center py-5">
          <i className="bi bi-journal-plus display-4 text-muted"></i>
          <h5 className="mt-3">No notes found</h5>
          <p className="text-muted">
            {search ? 'Try a different search term.' : 'Create your first note!'}
          </p>
          {!search && (
            <Button variant="primary" onClick={() => navigate('/notes/new')}>
              <i className="bi bi-plus-circle me-2"></i> New Note
            </Button>
          )}
        </Alert>
      ) : (
        <>
          {/* Grid */}
          <Row>
            {notes.map(note => (
              <Col key={note._id} md={6} lg={4} className="mb-4">
                <Card className="h-100 shadow-sm border-0 hover-shadow">
                  <Card.Body className="d-flex flex-column">
                    <div className="mb-3">
                      <h5 className="card-title mb-2">
                        <Link to={`/notes/${note._id}`} className="text-decoration-none text-dark">
                          {truncateText(note.title, 50)}
                        </Link>
                      </h5>
                      <p className="card-text text-muted small">
                        {truncateText(note.content, 100)}
                      </p>
                    </div>

                    <div className="mt-auto">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <small className="text-muted">
                          <i className="bi bi-clock me-1"></i>{formatDate(note.updatedAt)}
                        </small>
                        <Badge bg="light" text="dark">{countWords(note.content)} words</Badge>
                      </div>
                      <div className="d-flex gap-1">
                        <Button as={Link} to={`/notes/${note._id}`} size="sm" variant="outline-primary" className="flex-fill">
                          <i className="bi bi-pencil me-1" /> Edit
                        </Button>
                        <Button size="sm" variant="outline-danger" onClick={() => handleDelete(note._id, note.title)}>
                          <i className="bi bi-trash" />
                        </Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <Row className="mt-4">
              <Col className="d-flex justify-content-center">
                <nav>
                  <ul className="pagination">
                    <li className={`page-item ${!pagination.hasPrev ? 'disabled' : ''}`}>
                      <button className="page-link" disabled={!pagination.hasPrev}
                        onClick={() => setCurrentPage(p => p - 1)}>
                        <i className="bi bi-chevron-left" />
                      </button>
                    </li>

                    {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
                      <li key={p} className={`page-item ${p === currentPage ? 'active' : ''}`}>
                        <button className="page-link" onClick={() => setCurrentPage(p)}>
                          {p}
                        </button>
                      </li>
                    ))}

                    <li className={`page-item ${!pagination.hasNext ? 'disabled' : ''}`}>
                      <button className="page-link" disabled={!pagination.hasNext}
                        onClick={() => setCurrentPage(p => p + 1)}>
                        <i className="bi bi-chevron-right" />
                      </button>
                    </li>
                  </ul>
                </nav>
              </Col>
            </Row>
          )}
        </>
      )}

      {/* Spinner while changing page */}
      {loading && notes.length > 0 && (
        <div className="text-center py-3">
          <Spinner animation="border" size="sm" variant="primary" />
          <span className="ms-2 text-muted">Loading…</span>
        </div>
      )}

      <style jsx>{`
        .hover-shadow { transition: box-shadow .2s; }
        .hover-shadow:hover { box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important; }
      `}</style>
    </div>
  );
};

export default NotesList;
