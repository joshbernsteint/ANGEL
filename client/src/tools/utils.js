
//Converts a time from seconds into HH:MM:SS
export function convertTime(length_seconds){

    function padZero(time){
        return (time < 10) ? `0${time}` : `${time}`
    }
    const hours = Math.floor(length_seconds / 3600)
    length_seconds %= 3600;
    const minutes = Math.floor(length_seconds / 60);
    length_seconds %= 60;

    return `${padZero(hours)}:${padZero(minutes)}:${padZero(length_seconds)}`
}
