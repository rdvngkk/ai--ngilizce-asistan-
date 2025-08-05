import type { Message } from './types';

export const INITIAL_MESSAGE: Message = {
    role: 'model',
    text: `🌟 Merhaba! Ben senin AI İngilizce asistanınım. Bana şunları sorabilirsin:
<br/><br/>
📝 **"Bu cümle doğru mu?"** - Gramer kontrolü<br/>
📚 **"Beautiful ne demek?"** - Kelime anlamları<br/>
🔊 **"Bu nasıl okunur?"** - Sesli telaffuz yardımı<br/>
🌐 **"2024'ün popüler İngilizce argoları neler?"** - İnternet destekli güncel bilgiler<br/>
💡 **"İngilizce nasıl öğrenilir?"** - Öğrenme tavsiyeleri<br/>
<br/>
Başlayalım! Nasıl yardımcı olabilirim? 🚀`
};

export const FEATURES = [
    {
        icon: '📝',
        title: 'Gramer Kontrolü',
        description: 'Cümlelerini düzeltirim'
    },
    {
        icon: '📚',
        title: 'Kelime Anlamları',
        description: 'Binlerce kelimeyi biliyorum'
    },
    {
        icon: '🔊',
        title: 'Sesli Telaffuz',
        description: 'Doğru telaffuzu dinle'
    },
    {
        icon: '🌐',
        title: 'Güncel Bilgiler',
        description: 'İnternetten anlık cevaplar'
    },
    {
        icon: '💡',
        title: 'Öğrenme Tavsiyeleri',
        description: 'Sana özel ipuçları'
    }
];
