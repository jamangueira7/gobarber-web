import React from 'react';
import { FiPower, FiClock } from 'react-icons/fi/index';
import {
  Container,
  Header,
  HeaderContent,
  Profiler,
  Content,
  Schedule,
  NextAppointment,
  Calendar,
} from './styles';

import logoImg from '../../assets/logo.svg';

import { UseAuth } from '../../hooks/auth';

const Dashboard: React.FC = () => {
  const { singOut, user } = UseAuth();

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
        </Schedule>
        <Calendar />
      </Content>
    </Container>
  );
};

export default Dashboard;
