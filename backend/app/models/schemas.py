from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field

from backend.app.models.domain import (
    CycleStatus,
    EventSource,
    EventType,
    OrderStatus,
    TableState,
)


# -----------------------------------------------------------------------------
# Table & Floor Schemas
# -----------------------------------------------------------------------------
class TableBase(BaseModel):
    table_id: str = Field(..., description="Unique table code, e.g. T01")
    display_name: str = Field(..., description="Human readable name, e.g. Table 1 (Window)")
    capacity: int = Field(default=4, ge=1)
    camera_id: str = Field(default="CAM_01")
    zone_polygon: List[List[float]] = Field(
        ..., description="List of [x, y] coordinates forming the polygon in camera space"
    )


class TableCreate(TableBase):
    pass


class TableResponse(TableBase):
    current_state: TableState = TableState.FREE
    current_cycle_id: Optional[str] = None
    occupancy_count: int = 0
    state_updated_at: datetime = Field(default_factory=datetime.utcnow)


# -----------------------------------------------------------------------------
# Table Event & Cycle Schemas
# -----------------------------------------------------------------------------
class TableEventSchema(BaseModel):
    event_id: str
    cycle_id: str
    table_id: str
    event_type: EventType
    source: EventSource
    occurred_at: datetime = Field(default_factory=datetime.utcnow)
    confidence: Optional[float] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)


class TableCycleResponse(BaseModel):
    cycle_id: str
    table_id: str
    status: CycleStatus = CycleStatus.ACTIVE
    arrival_at: Optional[datetime] = None
    first_order_at: Optional[datetime] = None
    departure_at: Optional[datetime] = None
    cleaned_at: Optional[datetime] = None
    closed_at: Optional[datetime] = None
    estimated_guest_count: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    events: List[TableEventSchema] = Field(default_factory=list)


# -----------------------------------------------------------------------------
# Menu & Order Schemas
# -----------------------------------------------------------------------------
class MenuItemSchema(BaseModel):
    item_id: str
    category_id: str
    name: str
    description: str = ""
    price: float = Field(..., ge=0.0)
    image_reference: Optional[str] = None
    available: bool = True


class MenuCategorySchema(BaseModel):
    category_id: str
    name: str
    display_order: int = 0
    items: List[MenuItemSchema] = Field(default_factory=list)


class OrderItemRequest(BaseModel):
    item_id: str
    quantity: int = Field(..., ge=1)


class OrderCreateRequest(BaseModel):
    table_id: str
    items: List[OrderItemRequest]
    idempotency_key: Optional[str] = None


class OrderItemSnapshot(BaseModel):
    item_id: str
    name_snapshot: str
    price_snapshot: float
    quantity: int
    subtotal: float


class OrderResponse(BaseModel):
    order_id: str
    restaurant_id: str
    table_id: str
    cycle_id: str
    status: OrderStatus = OrderStatus.SUBMITTED
    items: List[OrderItemSnapshot]
    subtotal: float
    tax: float
    total: float
    submitted_at: datetime = Field(default_factory=datetime.utcnow)
    acknowledged_at: Optional[datetime] = None


# -----------------------------------------------------------------------------
# Action & WebSocket Schemas
# -----------------------------------------------------------------------------
class ConfirmCleanRequest(BaseModel):
    table_id: str
    staff_id: Optional[str] = "manager"


class CVEventPayload(BaseModel):
    table_id: str
    event_type: EventType
    occupancy_count: int
    confidence: float = 1.0
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    metadata: Dict[str, Any] = Field(default_factory=dict)


class WebSocketMessage(BaseModel):
    event: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    payload: Dict[str, Any]
