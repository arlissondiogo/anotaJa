package com.uepb.project.anotaJa.domain.user.exception;

public class EmailAlreadyInUseException extends RuntimeException {

    public EmailAlreadyInUseException() {
        super("Email is already in use");
    }
}