import React from 'react';
import { FiPower } from 'react-icons/fi/index';
import {
  Container,
  Header,
  HeaderContent,
  Profiler,
} from './styles';

import logoImg from '../../assets/logo.svg';

import { UseAuth } from '../../hooks/auth';

const Dashboard: React.FC = () => {
  console.log('fdfdfd');
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
    </Container>
  );
};

export default Dashboard;
