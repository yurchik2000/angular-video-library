export interface IMovieResponce {
    Actors: string,
    Awards: string,
    boxOffice: string,
    Country: string,
    date: Date,
    Director: string,
    Genre: string,
    Language: string,    
    Plot: string,
    Poster: string,
    production: string,
    Rated: string,
    Ratings: Array<IRating>,
    released: Date,
    response: boolean,
    Runtime: string,
    Title: string,
    Type: string,
    Website: string,
    Writer: string,
    Year: number,
    imdbId: string,
    imdbRating: string,
    imdbVotes: number,
    totalSeasons: string
}

export interface IRating {
    Source: string,
    Value: string
}

export interface IMovie {
    id: string,
    title: string,
    year: number,
    imdbRating: number,    
    myRating: number,
    rtRating: string,
    plot: string,
    poster: string,
    director: Array<string>,
    genres: Array<string>,
    actors: Array<string>,
    writer: Array<string>,
    rated: string,
    watched: boolean,
    favourite: boolean,
    dateAdding: Date,
    country: Array<string>,
    awards: string,
    type: string,
    tags: Array<string>,
    archive: boolean,
    runTime: string,
    totalSeasons: string,    
}

export interface ISearchResponce {
    Response: boolean,
    Search: Array<ISearchListMovie>,    
    totalResults: number,    
}
export interface ISearchListMovie {
    Poster: string,
    Title: string,
    Type: string,
    Year: number,
    imdbID: string
}

export interface IUser {
    poster: string,
    name: string,
    email: string,
    moviesId: Array<string>,
    friendsList: Array<string>,
    uid: string
}

export interface IMyMovie {
    id: string,    
    myRating: number,
    watched: boolean,
    favourite: boolean,
    dateAdding: Date,
    tags: Array<string>,
    archive: boolean,
    comment: string
}
export interface IArchiveMovie {
    id: string,    
    title: string,
    year: number,
    genres: Array<string>,
    poster: string,
    type: string,
    myRating: number,
    favourite: boolean,
    watched: boolean,
    dateAdding: Date,
    tags: Array<string>,    
    comment: string
}


export interface IShortMovie {
    title: string,
    poster: string,
    id: string,
    type: string
}

export interface IActor {
    name: string,
    poster: string,
    known_for: Array<IShortMovie>
}

export interface ICast {
    name: string,
    character: string,
    poster: string    
}

export interface IVideoContent {
    adult: boolean
    backdrop_path: string
    genre_ids: number[]
    id: number
    original_language: string
    original_title: string
    overview: string
    popularity: number
    poster_path: string
    release_date: string
    title: string
    video: boolean
    vote_average: number
    vote_count: number
    name: string
    first_air_date: string
    media_type: string
    profile_path: string
    categoryTitle: string
  }

  export interface IAwardContent {
    id: string,        
    title: string,
    type: string,
    movie: string 
  }


  
  