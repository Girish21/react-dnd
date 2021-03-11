import React from 'react'
import { useDrag, useDrop } from 'react-dnd'
import styled from 'styled-components'
import tw from 'twin.macro'

enum ItemTypes {
  CARD_TYPE_1 = 'CARD_TYPE_1',
  CARD_TYPE_2 = 'CARD_TYPE_2',
}

type DropContainerProps = {
  accept: ItemTypes
}

type DragContainerProps = {
  type: ItemTypes
  label: string
}

type StyledDropContainerProps = {
  isActive: boolean
  canDrop: boolean
}

type StyledDragContainerProps = {
  isDragging: boolean
}

const StyledDropContainer = styled.div<StyledDropContainerProps>(
  ({ canDrop, isActive }) => [
    tw`w-1/4 h-64 bg-gray-700`,
    canDrop && tw`bg-blue-700`,
    isActive && tw`bg-green-700`,
  ],
)

const StyledDragContainer = styled.div<StyledDragContainerProps>(
  ({ isDragging }) => [
    tw`p-2 border border-gray-400 border-dotted`,
    isDragging &&
      tw`transition-transform transform origin-top-left rotate-6 bg-purple-200`,
  ],
)

function DragCards({ type, label }: DragContainerProps) {
  const [{ isDragging }, dragRef] = useDrag(
    () => ({
      type,
      collect: monitor => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [type],
  )

  return (
    <StyledDragContainer ref={dragRef} isDragging={isDragging}>
      {label}
    </StyledDragContainer>
  )
}

function DropContainer({ accept }: DropContainerProps) {
  const [{ canDrop, isOver }, dropRef] = useDrop(
    () => ({
      accept: accept,
      collect: monitor => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [accept],
  )

  const isActive = canDrop && isOver

  return (
    <StyledDropContainer ref={dropRef} isActive={isActive} canDrop={canDrop} />
  )
}

function App() {
  return (
    <div className='w-full h-screen grid place-items-center'>
      <div className='flex justify-between items-center w-3/4'>
        <DropContainer accept={ItemTypes.CARD_TYPE_1} />
        <DropContainer accept={ItemTypes.CARD_TYPE_2} />
      </div>
      <div className='w-9/12 flex justify-around items-center self-start justify-self-center'>
        <DragCards label='1' type={ItemTypes.CARD_TYPE_1} />
        <DragCards label='2' type={ItemTypes.CARD_TYPE_2} />
        <DragCards label='3' type={ItemTypes.CARD_TYPE_1} />
        <DragCards label='4' type={ItemTypes.CARD_TYPE_2} />
        <DragCards label='5' type={ItemTypes.CARD_TYPE_1} />
        <DragCards label='6' type={ItemTypes.CARD_TYPE_2} />
      </div>
    </div>
  )
}

export default App
