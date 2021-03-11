import React from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { v4 as uuid } from 'uuid'

const map = new Map<string, string>()
const proxy = new Proxy<Record<string, string>>(
  {},
  {
    get: (_, prop: string) => {
      if (!map.has(prop)) {
        map.set(prop, uuid())
      }
      return map.get(prop)
    },
  },
)

type DropDataType = {
  id: string
}

type DataContextType = {
  bins: BinType[]
  cards: CardsType[]
  onDrop: (item: DropDataType, bucketIndex: number) => void
}

const DataContext = React.createContext<DataContextType>({
  bins: [],
  cards: [],
  onDrop: () => {},
})

type CardsType = {
  type: string
  label: string
  id: string
}

type BinType = {
  accept: string | string[]
  label: string
  id: string
  childrens: CardsType[]
}

function useDataContext() {
  return React.useContext(DataContext)
}

function DataContextProvider(props: any) {
  const [buckets, setBuckets] = React.useState<BinType[]>(() => [
    {
      accept: [proxy.card_1, proxy.card_3],
      childrens: [],
      label: 'Bucket 1',
      id: uuid(),
    },
    {
      accept: [proxy.card_2, proxy.card_3],
      childrens: [],
      label: 'Bucket 2',
      id: uuid(),
    },
  ])
  const [cards, setCards] = React.useState<CardsType[]>(() => [
    {
      id: uuid(),
      label: 'Card 1',
      type: proxy.card_1,
    },
    {
      id: uuid(),
      label: 'Card 2',
      type: proxy.card_2,
    },
    {
      id: uuid(),
      label: 'Card 3',
      type: proxy.card_2,
    },
    {
      id: uuid(),
      label: 'Card 4',
      type: proxy.card_3,
    },
    {
      id: uuid(),
      label: 'Card 5',
      type: proxy.card_1,
    },
  ])

  const onDrop = React.useCallback(
    (item: DropDataType, bucketIndex: number) => {
      const card = cards.find(card => card.id === item.id)
      if (card) {
        setBuckets(buckets => [
          ...buckets.slice(0, bucketIndex),
          {
            ...buckets[bucketIndex],
            childrens: [...buckets[bucketIndex].childrens, card],
          },
          ...buckets.slice(bucketIndex + 1),
        ])
        setCards(cards => cards.filter(card => card.id !== item.id))
      }
    },
    [cards],
  )

  const values: DataContextType = React.useMemo(
    () => ({
      bins: buckets,
      cards,
      onDrop,
    }),
    [buckets, cards, onDrop],
  )

  return <DataContext.Provider value={values} {...props} />
}

function Dropzone({
  accept,
  childrens,
  label,
  onDrop,
}: BinType & { onDrop: (item: DropDataType) => void }) {
  const [{ canDrop }, dropRef] = useDrop(() => ({
    accept,
    collect: monitor => ({
      canDrop: monitor.canDrop(),
      isOver: monitor.isOver(),
    }),
    drop: onDrop,
  }))
  return (
    <div
      ref={dropRef}
      className='w-1/2 border border-blue-300 ring ring-offset-blue-400 bg-blue-100 p-4'
    >
      <h2 className='font-bold text-2xl text-blue-800'>{label}</h2>
      {childrens.length > 0 && (
        <ul className='py-2 space-y-4'>
          {childrens.map(({ id, label }) => (
            <li
              key={id}
              className='p-2 border border-gray-500 ring ring-gray-500'
            >
              <h5 className='text-base font-bold text-gray-800'>{label}</h5>
            </li>
          ))}
        </ul>
      )}
      {canDrop && (
        <div className='border-4 border-dashed border-gray-600 p-6 grid place-content-center'>
          <h3 className='text-xl font-bold text-gray-700 text-center'>
            + Drop here
          </h3>
        </div>
      )}
    </div>
  )
}

function Card({ id, label, type }: CardsType) {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type,
    item: { id },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  }))

  return (
    <div
      ref={dragRef}
      className={`w-full p-4 border bg-yellow-200 border-green-400 ring ring-gray-300 ${
        isDragging ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <h4 className='font-bold text-xl text-gray-800'>{label}</h4>
    </div>
  )
}

function Dropzones() {
  const { bins, onDrop } = useDataContext()

  return (
    <>
      {bins.map((dropzoneProps, index) => (
        <Dropzone
          {...dropzoneProps}
          onDrop={item => onDrop(item, index)}
          key={dropzoneProps.id}
        />
      ))}
    </>
  )
}

function Cards() {
  const { cards } = useDataContext()
  return (
    <>
      {cards.map(cardProps => (
        <Card {...cardProps} key={cardProps.id} />
      ))}
    </>
  )
}

function App() {
  return (
    <DataContextProvider>
      <div className='flex h-screen bg-pink-200'>
        <div className='w-10/12 flex flex-col items-center justify-around'>
          <Dropzones />
        </div>
        <div className='flex-1 p-4 flex flex-col items-center justify-start space-y-4'>
          <Cards />
        </div>
      </div>
    </DataContextProvider>
  )
}

export default App
