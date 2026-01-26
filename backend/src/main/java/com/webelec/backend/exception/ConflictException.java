package com.webelec.backend.exception;

import java.util.List;

public class ConflictException extends RuntimeException {

    private static final long serialVersionUID = 1L;
	private final List<String> details;

    public ConflictException(String message) {
        this(message, List.of());
    }

    public ConflictException(String message, List<String> details) {
        super(message);
        this.details = details;
    }

    public List<String> details() {
        return details;
    }
}
