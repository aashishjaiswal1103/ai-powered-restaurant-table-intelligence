from enum import Enum


class TableState(str, Enum):
    FREE = "FREE"
    GUEST_ARRIVED = "GUEST_ARRIVED"
    ORDERED = "ORDERED"
    GUEST_DINING = "GUEST_DINING"
    GUEST_LEFT = "GUEST_LEFT"
    CLEANED = "CLEANED"


class EventType(str, Enum):
    CV_ARRIVAL = "CV_ARRIVAL"
    QR_ORDER = "QR_ORDER"
    SYS_DINING = "SYS_DINING"
    CV_DEPARTURE = "CV_DEPARTURE"
    STAFF_CLEANED = "STAFF_CLEANED"
    STAFF_OVERRIDE = "STAFF_OVERRIDE"


class EventSource(str, Enum):
    COMPUTER_VISION = "computer_vision"
    QR_ORDER = "qr_order"
    MANAGER = "manager"
    STAFF = "staff"
    SYSTEM = "system"


class OrderStatus(str, Enum):
    SUBMITTED = "SUBMITTED"
    ACKNOWLEDGED = "ACKNOWLEDGED"
    CANCELLED = "CANCELLED"


class CycleStatus(str, Enum):
    ACTIVE = "ACTIVE"
    CLOSED = "CLOSED"
    CANCELLED = "CANCELLED"
