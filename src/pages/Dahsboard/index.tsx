import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { Link } from 'react-router-dom';

import {
  isToday,
  format,
  parseISO,
  isAfter,
} from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import DayPicker, { DayModifiers } from 'react-day-picker';
import { FiPower, FiClock } from 'react-icons/fi/index';

import api from '../../services/api';

import 'react-day-picker/lib/style.css';

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

interface Appointments {
  id: string;
  date: string;
  hourFormatted: string;
  user: {
    name: string;
    avatar_url: string;
  };
}

interface MonthAvailabilityItem {
  day: number;
  available: boolean;
}

const Dashboard: React.FC = () => {
  const [selectDate, setSelectDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [monthAvailability, setMonthAvailability] = useState<MonthAvailabilityItem[]>([]);
  const [appointments, setAppointments] = useState<Appointments[]>([]);

  const { singOut, user } = UseAuth();

  const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
    if (modifiers.available && !modifiers.disabled) {
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

  useEffect(() => {
    api.get<Appointments[]>('/appointments/me', {
      params: {
        year: selectDate.getFullYear(),
        month: selectDate.getMonth() + 1,
        day: selectDate.getDate(),
      },
    }).then((response) => {
      const appointmentsFormatted = response.data.map((appointment) => {
        return {
          ...appointment,
          hourFormatted: format(parseISO(appointment.date), 'HH:mm'),
        };
      });
      setAppointments(appointmentsFormatted);

    });
  }, [selectDate]);

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

  const selectedDateAsText = useMemo(() => {
    return format(selectDate, "'Dia' dd 'de' MMMM", {
      locale: ptBR,
    });
  }, [selectDate]);

  const selectedWeekDay = useMemo(() => {
    return format(selectDate, 'cccc', {
      locale: ptBR,
    });
  }, [selectDate]);

  const morningAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      return parseISO(appointment.date).getHours() < 12;
    });
  }, [appointments]);

  const afternoonAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      return parseISO(appointment.date).getHours() >= 12;
    });
  }, [appointments]);

  const nextAppointment = useMemo(() => {
    return appointments.find((appointment) => {
      return isAfter(parseISO(appointment.date), new Date());
    });
  }, [appointments]);

  return (
    <Container>
      <Header>
        <HeaderContent>
          <img src={logoImg} alt="GoBarber" />
          <Profiler>
            <img src={user.avatar_url} alt={user.name} />
            <div>
              <span>Bem vindo</span>
              <Link to="profile"><strong>{user.name}</strong></Link>
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
            {isToday(selectDate) && <span>Hoje</span>}
            <span>{selectedDateAsText}</span>
            <span>{selectedWeekDay}</span>
          </p>
          {isToday(selectDate) && nextAppointment && (
            <NextAppointment>
              <strong>Agendamento a seguir</strong>
              <div>
                <img src={nextAppointment.user.avatar_url} alt={nextAppointment.user.name} />
                <strong>{nextAppointment.user.name}</strong>
                <span>
                  <FiClock />
                  {nextAppointment.hourFormatted}
                </span>
              </div>
            </NextAppointment>
          )}
          <Section>
            <strong>Manhã</strong>
            {morningAppointments.length === 0 && (
              <p>Nenhum agendamento neste período.</p>
            )}
            {morningAppointments.map((appointment) => (
              <Appointment key={appointment.id}>
                <FiClock />
                {appointment.hourFormatted}
                <div>
                  <img src={appointment.user.avatar_url} alt={appointment.user.name} />
                  <strong>{appointment.user.name}</strong>
                </div>
              </Appointment>
            ))}
          </Section>
          <Section>
            <strong>Tarde</strong>
            {afternoonAppointments.length === 0 && (
              <p>Nenhum agendamento neste período.</p>
            )}
            {afternoonAppointments.map((appointment) => (
              <Appointment key={appointment.id}>
                <FiClock />
                {appointment.hourFormatted}
                <div>
                  <img src={appointment.user.avatar_url} alt={appointment.user.name} />
                  <strong>{appointment.user.name}</strong>
                </div>
              </Appointment>
            ))}
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
