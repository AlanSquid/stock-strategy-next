'use client';
import { React } from "react";
import Link from "next/link";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { Container, Nav, Navbar } from "react-bootstrap";

export default function Header() {
  return (
<header >
      <Navbar  bg="dark" data-bs-theme="dark" expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand>Stock Strategy</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as="div">
                <Link href="/">搜尋股票</Link>
              </Nav.Link>
              <Nav.Link as="div">
                <Link href="/correlation/positive">正相關</Link>
              </Nav.Link>
              <Nav.Link as="div">
                <Link href="/correlation/negative">負相關</Link>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}

