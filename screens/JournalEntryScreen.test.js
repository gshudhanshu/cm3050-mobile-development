import React from 'react'
import { fireEvent, render, act } from '@testing-library/react-native'
import JournalEntryScreen from './JournalEntryScreen' // Adjust the import path as needed
import * as ImagePicker from 'expo-image-picker'
import * as Yup from 'yup'
import { Formik } from 'formik'

// Mock external libraries and navigation
jest.mock('expo-image-picker')
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}))
jest.mock('../store/useJournalStore', () => () => ({
  addJournal: jest.fn(),
  editJournal: jest.fn(),
  deleteJournal: jest.fn(),
}))
jest.mock('../store/useAuthStore', () => () => ({
  user: { uid: 'test-uid' },
}))

describe('JournalEntryScreen', () => {
  beforeEach(() => {
    ImagePicker.launchImageLibraryAsync.mockClear()
  })

  it('submits the journal entry correctly', async () => {
    const initialValues = {
      title: '',
      description: '',
      date: new Date(),
      imageUri: '',
    }

    const submitMock = jest.fn()
    const { getByPlaceholderText, getByText } = render(
      <Formik initialValues={initialValues} onSubmit={submitMock}>
        {(props) => <JournalEntryScreen {...props} />}
      </Formik>
    )

    await act(async () => {
      fireEvent.changeText(getByPlaceholderText('Title'), 'Test Title')
      fireEvent.changeText(
        getByPlaceholderText('Description'),
        'Test Description'
      )
      fireEvent.press(getByText('Submit Journal'))
    })

    expect(submitMock).toHaveBeenCalledWith(
      {
        ...initialValues,
        title: 'Test Title',
        description: 'Test Description',
      },
      expect.anything()
    ) // Formik passes a lot of props to the onSubmit function, so we're using expect.anything() for simplicity
  })

  it('picks an image and sets the field value', async () => {
    const setFieldValueMock = jest.fn()
    const resultMock = {
      cancelled: false,
      assets: [{ uri: 'https://example.com/test-image.jpg' }],
    }
    ImagePicker.launchImageLibraryAsync.mockResolvedValue(resultMock)

    const { getByTestId } = render(
      <JournalEntryScreen setFieldValue={setFieldValueMock} />
    )

    await act(async () => {
      fireEvent.press(getByTestId('imagePicker'))
    })

    expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalled()
    expect(setFieldValueMock).toHaveBeenCalledWith(
      'imageUri',
      'https://example.com/test-image.jpg'
    )
  })

  it('opens and sets date from date picker', async () => {
    const setFieldValueMock = jest.fn()
    const { getByTestId } = render(
      <JournalEntryScreen setFieldValue={setFieldValueMock} />
    )
    const testDate = new Date(2021, 1, 1) // Example date

    await act(async () => {
      fireEvent.press(getByTestId('datePickerButton'))
      fireEvent(getByTestId('dateTimePicker'), 'onChange', {}, testDate)
    })

    expect(setFieldValueMock).toHaveBeenCalledWith('date', testDate)
  })
})
