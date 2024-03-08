import useJournalStore from './useJournalStore'
import { uriToBlob } from '../utils/utils'
import { Timestamp, getDocs } from 'firebase/firestore'

const dummyJournal = {
  title: 'My Journal',
  description: 'This is a journal entry',
  date: new Date(),
  imageUrl: 'mocked-url',
}

jest.mock('../utils/utils', () => ({
  uriToBlob: jest
    .fn()
    .mockResolvedValue(new Blob(['fake-blob'], { type: 'image/jpeg' })),
}))

describe('useJournalStore', () => {
  beforeEach(() => {
    useJournalStore.setState({
      journals: [dummyJournal],
    })
    jest.resetAllMocks()
  })
  it('directly tests uriToBlob mock', async () => {
    const result = await uriToBlob('fake-uri')
    expect(uriToBlob).toHaveBeenCalledWith('fake-uri')
  })
  it('uploadJournalImage', async () => {
    const userId = 'test-user'
    const imageUri = 'fake-uri'
    const imageUrl = await useJournalStore
      .getState()
      .uploadJournalImage(userId, imageUri)
    expect(uriToBlob).toHaveBeenCalledWith('fake-uri')
  })

  // it('fetchJournals', async () => {
  //   const userId = 'test-user'
  //   await useJournalStore.getState().fetchJournals(userId)
  //   expect(useJournalStore.getState().journals).toEqual([dummyJournal])
  // })
})
