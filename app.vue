<template>
  <div class="chat-container">
    <div class="chat-header">
      <h2>Chat Screen</h2>
    </div>
    <div class="chat-messages">
      <div v-for="(item, index) of state.allMessages" :key="index">
        <div
          class="message"
          :class="item.author === author ? 'sent' : 'received'"
        >
          <p>{{ item.value }}</p>
        </div>
      </div>
    </div>

    <form class="chat-input" @submit.prevent="sendMessage()">
      <input type="text" v-model="state.message" />
      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { setInterval } from 'timers/promises';
import { Message } from './utils/Message';

const { $io } = useNuxtApp();

const makeId = (length: number) => {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};

const storeAuthor = (author: string) => {
  if (process.client) {
    localStorage.setItem('author', author);
  }
};

const getAuthor = () => {
  if (process.client) {
    return localStorage.getItem('author') || storeAuthor(makeId(10));
  }
};

const author = ref(getAuthor());

$io.connect();

const state = reactive({
  message: '',
  allMessages: [] as Message[],
});

$io.on(SocketEvent.newMessage, (message: Message) => {
  state.allMessages = state.allMessages.concat(message);
});

$io.on(SocketEvent.messages, (messages: Message[]) => {
  state.allMessages = messages;
});

const sendMessage = () => {
  $io.emit(SocketEvent.newMessage, {
    value: state.message,
    author: author.value,
  });
  state.message = '';
};

onUnmounted(() => {
  $io.disconnect();
});

watch(
  () => state.allMessages,
  () => {
    const chatMessages = document.querySelector('.chat-messages');
    chatMessages.scrollTop = chatMessages.scrollHeight;
  },
  { flush: 'post' }
);
</script>
<style>
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
}

.chat-container {
  max-width: 600px;
  margin: 0 auto;
  margin: 20px 20px 0 20px;
}

.chat-header {
  text-align: center;
  margin-bottom: 20px;
}

.chat-messages {
  max-height: 400px;
  overflow-y: scroll;
}

.message {
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
}

.received {
  background-color: #f1f0f0;
  float: left;
  clear: both;
}

.sent {
  background-color: #dcf8c6;
  float: right;
  clear: both;
}

.timestamp {
  font-size: 12px;
  color: #888;
  display: block;
  margin-top: 5px;
}

.chat-input {
  margin-top: 20px;
  width: 100%;
  display: flex;
}

.chat-input input[type='text'] {
  width: 80%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  float: left;
}

.chat-input button {
  width: 20%;
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 0 5px 5px 0;
  cursor: pointer;
  float: left;
}
</style>
