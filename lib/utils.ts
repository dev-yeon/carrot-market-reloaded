export function formatToTimeAgo(date: string): string {
    const dayInMs = 1000 * 60 * 60 * 24; // 하루동안의 밀리초
    const time = new Date(date).getTime();
    const now = new Date().getTime();
    const difference = Math.round((time - now) / dayInMs);

    const formatter = new Intl.RelativeTimeFormat('ko');

    return formatter.format(difference, 'days');
}

export function formatToWon(price: number): string {
    return price.toLocaleString('ko-KR');
}
