from pydantic import BaseModel


class ChatbotState(BaseModel):
    user_id: str
    goal: str = None
    time_per_day: int = None
    target_level: str = None
    approach: str = None
    current_step: int = 0
