import { useContext, useEffect, useState } from 'react';
import { useGetRequest } from '../../common/hooks/useGetRequest';
import { Modal } from '../Modal';
import { BikeStation } from '../bike_stations/types';
import { CenteredLoader } from '../common/Loader';
import { InputGroup } from '../common/input/InputGroup';
import { InputItem, InputSize } from '../common/input/InputItem';
import { SelectInput } from '../common/input/SelectInput';
import { DateTimeInput } from '../common/input/DateTimeInput';
import { NumberInput } from '../common/input/NumberInput';
import { FormSubmitControls } from '../common/FormSubmitControls';
import { usePostRequest } from '../../common/hooks/usePostRequest';
import { Journey } from './types';
import { NotificationContext, NotificationType } from '../Notification';

const MIN_DISTANCE_IN_METERS = 10;
const MAX_DISTANCE_IN_METERS = 1000000;
const MIN_DURATION_IN_SECONDS = 10;
const MAX_DURATION_IN_SECONDS = 1000000;

interface JourneyModalProps {
  onCancel(): void;
}

export const JourneyModal = (props: JourneyModalProps) => {
  const { data: bikeStations, loading } = useGetRequest<Array<BikeStation>>('/bike-stations');
  const { post, loading: postLoading } = usePostRequest<Journey>('/journeys');
  const [departureStationId, setDepartureStationId] = useState<number | null>(null);
  const [returnStationId, setReturnStationId] = useState<number | null>(null);
  const [departureTime, setDepartureTime] = useState<Date | null>(null);
  const [returnTime, setReturnTime] = useState<Date | null>(null);
  const [distanceInMeters, setDistanceInKm] = useState<number | null>(null);
  const [durationInSeconds, setDurationInMin] = useState<number | null>(null);
  const [errors, setErrors] = useState<Array<string>>([]);
  const [isValid, setIsValid] = useState<boolean>(false);
  const { showNotification } = useContext(NotificationContext);

  const allFieldsSet =
    departureStationId !== null &&
    returnStationId !== null &&
    departureTime !== null &&
    returnTime !== null &&
    distanceInMeters !== null &&
    durationInSeconds !== null;

  useEffect(() => {
    const errorMessages = validateInputs();
    setErrors(errorMessages);
    setIsValid(errorMessages.length === 0);
  }, [departureStationId, returnStationId, departureTime, returnTime, distanceInMeters, durationInSeconds]);

  const validateInputs = () => {
    const errorMessages = [];

    if (!allFieldsSet) {
      errorMessages.push('All input fields are required');
      return errorMessages;
    }

    if (departureTime > returnTime) {
      errorMessages.push('Departure time cannot be before return time');
    }

    if (returnTime.getTime() > Date.now()) {
      errorMessages.push('Return time cannot be in the future');
    }

    if (distanceInMeters < MIN_DISTANCE_IN_METERS || distanceInMeters > MAX_DISTANCE_IN_METERS) {
      errorMessages.push(`Distance must be within ${MIN_DISTANCE_IN_METERS}-${MAX_DISTANCE_IN_METERS} meters range`);
    }

    if (durationInSeconds < MIN_DURATION_IN_SECONDS || durationInSeconds > MAX_DURATION_IN_SECONDS) {
      errorMessages.push(`Duration must be within ${MIN_DURATION_IN_SECONDS}-${MAX_DURATION_IN_SECONDS} seconds range`);
    }

    return errorMessages;
  };

  const handleDateTimeInput = (input: string, callback: (date: Date | null) => void) => {
    const date = new Date(input);
    if (isNaN(date.getTime())) {
      callback(null);
    } else {
      callback(date);
    }
  };

  const handleNumberInput = (input: string, callback: (value: number | null) => void) => {
    const value = parseFloat(input);
    if (isNaN(value)) {
      callback(null);
    } else {
      callback(value);
    }
  };

  const handleSubmit = async () => {
    if (allFieldsSet) {
      const journey = {
        departureStationId: departureStationId,
        returnStationId: returnStationId,
        departureDateTime: departureTime.toUTCString(),
        returnDateTime: returnTime.toUTCString(),
        durationInSeconds: durationInSeconds,
        coveredDistanceInMeters: distanceInMeters,
      };
      const result = await post(journey);

      if (result?.status === 201 && result.data) {
        showNotification(
          `Journey from ${result.data.departureStationName} to ${result.data.returnStationName} added`,
          NotificationType.Success,
        );
        props.onCancel();
      } else {
        showNotification('Journey addition failed', NotificationType.Error);
      }
    }
  };

  const renderBikeStationOption = (bikeStation: BikeStation) => {
    return (
      <option key={bikeStation.id} value={bikeStation.id}>
        {bikeStation.name}, {bikeStation.city}
      </option>
    );
  };

  return (
    <Modal
      heading="Add new journey"
      content={
        loading ? (
          <CenteredLoader />
        ) : (
          bikeStations && (
            <div style={{ padding: '2rem' }}>
              <InputGroup>
                <InputItem size={InputSize.M}>
                  <SelectInput
                    id="departureStation"
                    label="Departure station"
                    options={bikeStations}
                    optionRenderer={renderBikeStationOption}
                    onChange={(e) => {
                      e.target.value === '' ? setDepartureStationId(null) : setDepartureStationId(+e.target.value);
                    }}
                  />
                </InputItem>
                <InputItem size={InputSize.M}>
                  <SelectInput
                    id="returnStation"
                    label="Return station"
                    options={bikeStations}
                    optionRenderer={renderBikeStationOption}
                    onChange={(e) => {
                      e.target.value === '' ? setReturnStationId(null) : setReturnStationId(+e.target.value);
                    }}
                  />
                </InputItem>
              </InputGroup>
              <InputGroup>
                <InputItem size={InputSize.M}>
                  <DateTimeInput
                    id="departureTime"
                    label="Departure time"
                    onChange={(e) => handleDateTimeInput(e.target.value, (date) => setDepartureTime(date))}
                  />
                </InputItem>
                <InputItem size={InputSize.M}>
                  <DateTimeInput
                    id="returnTime"
                    label="Return time"
                    onChange={(e) => handleDateTimeInput(e.target.value, (date) => setReturnTime(date))}
                  />
                </InputItem>
              </InputGroup>
              <InputGroup>
                <InputItem size={InputSize.M}>
                  <NumberInput
                    id="distance"
                    label="Distance (m)"
                    min={MIN_DISTANCE_IN_METERS}
                    max={MAX_DISTANCE_IN_METERS}
                    onChange={(e) => handleNumberInput(e.target.value, (value) => setDistanceInKm(value))}
                  />
                </InputItem>
                <InputItem size={InputSize.M}>
                  <NumberInput
                    id="duration"
                    label="Duration (s)"
                    min={MIN_DURATION_IN_SECONDS}
                    max={MAX_DURATION_IN_SECONDS}
                    onChange={(e) => handleNumberInput(e.target.value, (value) => setDurationInMin(value))}
                  />
                </InputItem>
              </InputGroup>
              {errors.map((error, i) => (
                <p key={i}>{error}</p>
              ))}
            </div>
          )
        )
      }
      footer={
        <FormSubmitControls
          loading={postLoading}
          disableSubmit={!isValid || postLoading}
          onCancel={props.onCancel}
          onSubmit={handleSubmit}
        />
      }
    />
  );
};
