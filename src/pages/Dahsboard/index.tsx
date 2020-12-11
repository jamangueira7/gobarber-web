import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import DayPicker, { DayModifiers } from 'react-day-picker';
import { FiPower, FiClock } from 'react-icons/fi/index';
import 'react-day-picker/lib/style.css';

import api from '../../services/api';

import {
  Container,
  Header,
  HeaderContent,
  Profiler,
  Content,
  Schedule,
  NextAppointment,
  Section,
  Appointment,
  Calendar,
} from './styles';

import logoImg from '../../assets/logo.svg';

import { UseAuth } from '../../hooks/auth';

interface MonthAvailabilityItem {
  day: number;
  available: boolean;
}

const Dashboard: React.FC = () => {
  const [selectDate, setSelectDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [monthAvailability, setMonthAvailability] = useState<MonthAvailabilityItem[]>([]);

  const { singOut, user } = UseAuth();

  const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
    if (modifiers.available) {
      setSelectDate(day);
    }
  }, []);

  const handleMonthChange = useCallback((month: Date) => {
    setCurrentMonth(month);
  }, []);

  useEffect(() => {
    api.get(`/providers/${user.id}/month-availability`, {
      params: {
        year: currentMonth.getFullYear(),
        month: currentMonth.getMonth() + 1,
      },
    }).then((response) => {
      setMonthAvailability(response.data);
    });
  }, [currentMonth, user.id]);

  const disableDays = useMemo(() => {
    const dates = monthAvailability
      .filter((monthDay) => monthDay.available === false)
      .map((monthDay) => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        return new Date(year, month, monthDay.day);
      });

    return dates;
  }, [currentMonth, monthAvailability]);

  return (
    <Container>
      <Header>
        <HeaderContent>
          <img src={logoImg} alt="GoBarber" />
          <Profiler>
            <img src={user.avatar_url} alt={user.name} />
            <div>
              <span>Bem vindo</span>
              <strong>{user.name}</strong>
            </div>
          </Profiler>
          <button type="button" onClick={singOut}>
            <FiPower />
          </button>
        </HeaderContent>
      </Header>
      <Content>
        <Schedule>
          <h1>Horários agendados</h1>
          <p>
            <span>Hoje</span>
            <span>Dia 06</span>
            <span>Segunda-feira</span>
          </p>
          <NextAppointment>
            <strong>Atendimento a seguir</strong>
            <div>
              <img src="https://avatars1.githubusercontent.com/u/1902749?s=460&u=382acdf7478c6499d9b4321e68523d17b699e802&v=4" alt="Diego fernandes" />
              <strong>Diego fernandes</strong>
              <span>
                <FiClock />
                08:00
              </span>
            </div>
          </NextAppointment>
          <Section>
            <strong>Manhã</strong>
            <Appointment>
              <FiClock />
              08:00
              <div>
                <img src="https://avatars1.githubusercontent.com/u/1902749?s=460&u=382acdf7478c6499d9b4321e68523d17b699e802&v=4" alt="Diego fernandes" />
                <strong>Diego fernandes</strong>
              </div>
            </Appointment>
            <Appointment>
              <FiClock />
              08:00
              <div>
                <img src="https://avatars1.githubusercontent.com/u/1902749?s=460&u=382acdf7478c6499d9b4321e68523d17b699e802&v=4" alt="Diego fernandes" />
                <strong>Diego fernandes</strong>
              </div>
            </Appointment>
          </Section>
          <Section>
            <strong>Tarde</strong>
            <Appointment>
              <FiClock />
              08:00
              <div>
                <img src="https://avatars1.githubusercontent.com/u/1902749?s=460&u=382acdf7478c6499d9b4321e68523d17b699e802&v=4" alt="Diego fernandes" />
                <strong>Diego fernandes</strong>
              </div>
            </Appointment>
          </Section>
        </Schedule>
        <Calendar>
          <DayPicker
            weekdaysShort={['D', 'S', 'T', 'Q', 'Q', 'S', 'S']}
            fromMonth={new Date()}
            modifiers={{
              available: { daysOfWeek: [1, 2, 3, 4, 5] },
            }}
            disabledDays={[
              { daysOfWeek: [0, 6] },
              ...disableDays,
            ]}
            onDayClick={handleDateChange}
            onMonthChange={handleMonthChange}
            selectedDays={selectDate}
            months={[
              'Janeiro',
              'Fevereiro',
              'Março',
              'Abril',
              'Maio',
              'Junho',
              'Julho',
              'Agosto',
              'Setembro',
              'Outubro',
              'Novembro',
              'Dezembro',
            ]}
          />
        </Calendar>
      </Content>
    </Container>
  );
};

export default Dashboard;
