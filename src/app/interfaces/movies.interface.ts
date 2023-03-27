export interface IMovieResponce {
    Actors: string,
    awards: string,
    boxOffice: string,
    country: string,
    date: Date,
    Director: string,
    Genre: string,
    language: string,
    raitingMetscore: number,
    Plot: string,
    Poster: string,
    production: string,
    rated: string,
    raitings: Array<IRating>,
    released: Date,
    response: boolean,
    runtime: string,
    Title: string,
    type: string,
    website: string,
    writer: string,
    Year: number,
    imdbId: string,
    imdbRating: number,
    imdbVotes: number,
}

export interface IRating {
    source: string,
    value: string
}

export interface IMovie {
    id: string,
    title: string,
    year: number,
    imdbRating: number,
    plot: string,
    poster: string,
    director: Array<string>,
    genres: Array<string>,
    actors: Array<string>
}
