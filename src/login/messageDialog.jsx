import React  from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export function MessageDialog(props) {
    return (
        <Modal show={props.message !== null} onHide={props.onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Message</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {props.message}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}