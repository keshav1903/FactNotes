import React from 'react';
import { Container } from 'react-bootstrap';
import Navigation from './Navigation';

const Layout = ({ children }) => {
  return (
    <div className="min-vh-100 bg-light">
      <Navigation />
      <main className="py-4">
        <Container>
          {children}
        </Container>
      </main>

      <footer className="bg-white border-top mt-auto py-3">
        <Container>
          <div className="row">
            <div className="col-md-6">
              <p className="text-muted mb-0">
                <small>© 2024 FactCheck Notepad. Built with MERN Stack.</small>
              </p>
            </div>
            <div className="col-md-6 text-md-end">
              <p className="text-muted mb-0">
                <small>
                  <i className="bi bi-shield-check me-1"></i>
                  AI-powered fact-checking for better accuracy
                </small>
              </p>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default Layout;
