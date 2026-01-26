package com.webelec.backend.dto;

public class NotificationSummaryDTO {

    private long unreadCount;
    private long criticalCount;

    public NotificationSummaryDTO() {
    }

    public NotificationSummaryDTO(long unreadCount, long criticalCount) {
        this.unreadCount = unreadCount;
        this.criticalCount = criticalCount;
    }

    public long getUnreadCount() {
        return unreadCount;
    }

    public void setUnreadCount(long unreadCount) {
        this.unreadCount = unreadCount;
    }

    public long getCriticalCount() {
        return criticalCount;
    }

    public void setCriticalCount(long criticalCount) {
        this.criticalCount = criticalCount;
    }
}
