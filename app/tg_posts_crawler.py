import asyncio
import json
import logging
import os

import pyrogram


class Controller:

    def __init__(self):
        self.log = logging.getLogger(__name__)
        self.log.setLevel(logging.DEBUG)
        console_handler = logging.StreamHandler()
        console_handler.setLevel(logging.INFO)
        console_handler.setFormatter(logging.Formatter('%(message)s'))
        self.log.addHandler(console_handler)
        file_handler = logging.FileHandler('log.log')
        file_handler.setLevel(logging.DEBUG)
        file_handler.setFormatter(logging.Formatter('%(asctime)s - %(levelname)s - %(module)s.%(funcName)s (%(lineno)d)\n%(message)s'))
        self.log.addHandler(file_handler)
        self.pyrogram_session_string = os.environ['PYROGRAM_SESSION_STRING']
        self.channel_id = int(os.environ['CHANNEL_ID'])
        self.refresh_data = True if os.getenv('REFRESH_DATA') == 'true' else False
        self.path_to_data = 'data.json'
        self.posts = []
        self.tags = []
        self.channel_username = None

    async def initialize(self):
        self.log.info('Запуск pyrogram-клиента')
        self.app = pyrogram.Client(
            'telegram_account',
            session_string=self.pyrogram_session_string,
            in_memory=True,
            no_updates=True,
            app_version='TG Posts Crawler',
        )
        await self.app.start()
        self.log.info('Клиент запущен')
        if self.refresh_data:
            self.log.info('Запрошено обновление данных, уже имеющиеся не будут загружены')
        else:
            self.load_data()

    def load_data(self):
        self.log.info('Выполняется загрузка данных')
        if not os.path.isfile(self.path_to_data):
            self.log.info('Данные отсутствуют')
            return
        with open(self.path_to_data, 'rb') as f:
            data = json.load(f)
        self.posts = data['posts']
        self.tags = data['tags']
        self.log.info(f'Загружено {len(self.posts)} постов и {len(self.tags)} тегов')

    def save_data(self):
        self.log.info('Выполняется сохранение данных')
        data = {
            'channel_username': self.channel_username,
            'posts': self.posts,
            'tags': self.tags,
        }
        with open(self.path_to_data, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=4)
        self.log.info(f'Сохранено {len(self.posts)} постов и {len(self.tags)} тегов')

    def get_tag_id(self, tag_name):
        search_tag_name = tag_name.lower()
        for tag in self.tags:
            if tag['tag'].lower() == search_tag_name:
                return tag['id']

    def add_tag(self, tag_name):
        tag = {
            'id': 1 if not self.tags else self.tags[-1]['id'] + 1,
            'tag': tag_name
        }
        self.tags.append(tag)
        return tag['id']

    def parse_post(self, post):
        self.log.debug(f'Парсинг поста {post.id}')
        data = {
            'id': post.id,
            'timestamp': int(post.date.timestamp()),
        }
        text = post.text or post.caption
        entities = post.entities or post.caption_entities or []
        if not text:
            return
        title = text.split('\n', 1)[0]
        if len(title) > 200:
            title = title[:199] + '…'
        data['title'] = title
        data['text'] = ''.join(f'<p>{line}</p>' for line in text.html.split('\n'))
        data['tags'] = []
        for entity in entities:
            if entity.type is not pyrogram.enums.MessageEntityType.HASHTAG:
                continue
            tag = text[entity.offset:entity.offset+entity.length]
            if (tag_id := self.get_tag_id(tag)) is None:
                tag_id = self.add_tag(tag)
            data['tags'].append(tag_id)
            data['text'] = data['text'].replace(tag, f'<a href="/tags/{tag_id}/>{tag}</a>', 1)
        return data

    async def start(self):
        await self.initialize()
        self.log.info('Начат сбор новых постов')
        new_posts = []
        last_post_id = self.posts[0]['id'] if self.posts else 0
        self.channel_username = (await self.app.get_chat(self.channel_id)).username
        async for post in self.app.get_chat_history(self.channel_id):
            if post.id <= last_post_id:
                break
            result = self.parse_post(post)
            if result is not None:
                new_posts.append(result)
        self.log.info(f'Собрано {len(new_posts)} новых постов')
        self.posts = new_posts + self.posts
        self.save_data()


if __name__ == '__main__':
    # For debugging
    try:
        import dotenv
        dotenv.load_dotenv()
    except ImportError:
        pass
    controller = Controller()
    asyncio.run(controller.start())
