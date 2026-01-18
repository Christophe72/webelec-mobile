package com.webelec.backend.util;

import org.mockito.ArgumentMatchers;
import org.springframework.lang.NonNull;

/**
 * Utilities to satisfy Spring's null analysis when using Mockito matchers.
 */
public final class MockitoNonNull {

    private MockitoNonNull() {
    }

    @NonNull
    @SuppressWarnings("null")
    public static <T> T anyNonNull(Class<T> type) {
        return ArgumentMatchers.any(type);
    }

    @NonNull
    @SuppressWarnings("null")
    public static <T> T anyNonNull() {
        return ArgumentMatchers.any();
    }
}
