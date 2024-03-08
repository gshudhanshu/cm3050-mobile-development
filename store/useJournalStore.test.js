import useJournalStore from './useJournalStore'

const dummyJournal = {
  title: 'My Journal',
  description: 'This is a journal entry',
  date: new Date(),
  imageUrl: 'mocked-url',
}

describe('useJournalStore', () => {
  // Reset store state before each test
  beforeEach(() => {
    useJournalStore.setState({
      journals: [],
    })
  })

  it('should upload a journal image and return its URL', async () => {
    const userId = 'testUid'
    const imageUri = 'fake-uri'
    const expectedImageUrl = 'mocked-url'
    uriToBlob.mockResolvedValueOnce(new Blob())

    const imageUrl = await useJournalStore
      .getState()
      .uploadJournalImage(userId, imageUri)

    expect(imageUrl).toBe(expectedImageUrl)
    expect(uriToBlob).toHaveBeenCalledWith(imageUri)
  })

  it('should add a journal and fetch journals', async () => {
    const userId = 'testUid'
    const journalData = { title: 'Test Journal', date: new Date() }
    const addJournal = useJournalStore.getState().addJournal

    await addJournal(userId, journalData)

    const journals = useJournalStore.getState().journals
    expect(journals.length).toBeGreaterThan(0)
    expect(journals[0].title).toEqual(journalData.title)
  })

  it('should delete a journal and update the journal list', async () => {
    const userId = 'testUid'
    const journalId = 'newJournalId'
    const deleteJournal = useJournalStore.getState().deleteJournal

    // First, mock adding a journal to ensure there's something to delete
    await useJournalStore.getState().addJournal(userId, {
      title: 'Journal to Delete',
      date: Timestamp.fromDate(new Date()),
    })
    // Then, delete the journal
    await deleteJournal(userId, journalId)

    const journals = useJournalStore.getState().journals
    // Assuming delete is successful, the journal with journalId should not exist
    expect(journals.find((journal) => journal.id === journalId)).toBeUndefined()
  })
})
