import { Namespace } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { addScore } from '../clients/backendClient';

const registerEvents = (io: Namespace) => {
  io.on('connection', (socket) => {
    const score = { value: 0, game_id: '', status: 'inactive' };
    console.log('connection', socket.data);
    socket.on('start_game', async () => {
      if (score.status === 'active') {
        return;
      }

      score.status = 'pending';
      score.game_id = uuidv4();
      console.log('start_game', score);

      socket.emit('started_game', score);

      // count down 3 seconds
      for (let i = 3; i >= 0; i--) {
        socket.emit('countdown', {
          countdown: i,
        });
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      score.status = 'active';

      // start game
      socket.emit('start_game', score);

      // play in 5 seconds
      setTimeout(async () => {
        score.status = 'inactive';
        const value = score.value;
        console.log('end_game', score);
        socket.emit('end_game', score);
        score.game_id = '';
        score.value = 0;
        const scoreData = await addScore(socket.data.userId, value);
        io.emit('broadcast_score', scoreData);
      }, 5000);
    });

    socket.on('click', () => {
      if (score.status !== 'active') {
        return;
      }

      score.value++;
      socket.emit('score', score);
    });
  });
};

export default registerEvents;