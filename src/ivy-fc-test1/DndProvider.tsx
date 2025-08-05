import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'
const MyDndProvider = ({ children }: { children: React.ReactNode }) => {
  return <DndProvider backend={HTML5Backend}>{children} </DndProvider>
}

export default MyDndProvider
