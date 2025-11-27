function Greeting() {
    const userName = 'Здаров заебал' +
        '' +
        '' +
        '' +
        '' +
        '' +
        ''; // можно заменить на своё имя
// получаем текущий час (0..23)
    const currentHour = new Date().getHours();
// определяем приветствие в зависимости от времени
    let timeOfDay; // переменная для хранения приветствия
    if (currentHour < 12) {
        timeOfDay = 'Доброе утро';
    }
    else if (currentHour < 18) {
        timeOfDay = 'Добрый день';
    } else {
        timeOfDay = 'Добрый вечер';
    }
    return (
        <div className="greeting">
            {/* вставляем динамическое приветствие и имя */}
            <h1>{timeOfDay}, {userName}!</h1>
            <p>Рады видеть вас в нашем приложении.</p>
        </div>
    );
}
export default Greeting;