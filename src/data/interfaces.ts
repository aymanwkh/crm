export interface iLabel {
    [key: string]: string
}
export interface iError {
  code: string,
  message: string
}
export interface iNotification {
  id: string,
  title: string,
  message: string,
  status: string,
  time: Date
}
export interface iUser {
  name: string,
  email: string
}
export interface iState {
  user?: iUser,
}

export interface iAction {
  type: string
  payload?: any
}

export interface iContext {
  state: iState;
  dispatch: React.Dispatch<iAction>
}