import React, { Component } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";


export class News extends Component {

    static defaultProps = {
        country: 'in',
        pageSize: 5,
        category: 'general'
    }

    static propTypes = {
        country: PropTypes.string,
        pageSize: PropTypes.number,
        category: PropTypes.string,
    }

    capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    constructor(props) {
        super(props);
        // console.log('Hello, I am constructor from news component.');
        this.state = {
            articles: [],
            loading: true,
            page: 1,
            totalResults: 0
        }
        document.title = `${this.capitalizeFirstLetter(this.props.category)} - NewsDesk`
    }



    // async updateNews() {
    //     const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=9dfa367e20c3460e808f9f3efa38c53d&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    //     this.setState({ loading: true });
    //     let data = await fetch(url);
    //     let parsedData = await data.json();
    //     this.setState({ articles: parsedData.articles, totalResults: parsedData.totalResults, loading: false });
    // }

    async componentDidMount() {
        this.props.setProgress(10);
        let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=e7198857fab346a2b4996cb9a7e87c0a&page=${this.state.page}&pageSize=${this.props.pageSize}`;
        this.setState({ loading: true });
        let data = await fetch(url);
        this.props.setProgress(30);
        let parsedData = await data.json();
        this.props.setProgress(70);
        this.setState({ articles: parsedData.articles, totalResults: parsedData.totalResults, loading: false });
        this.props.setProgress(100);
        //this.updateNews();
    }
    handlePrevClick = async () => {

        const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=9dfa367e20c3460e808f9f3efa38c53d&page=${this.state.page - 1}&pageSize=${this.props.pageSize}`;
        this.setState({ loading: true });
        let data = await fetch(url);
        let parsedData = await data.json();
        this.setState({
            articles: parsedData.articles,
            totalResults: parsedData.totalResults,
            loading: false,
            page: this.state.page - 1
        });
    }

    handleNextClick = async () => {

        const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=9dfa367e20c3460e808f9f3efa38c53d&page=${this.state.page + 1}&pageSize=${this.props.pageSize}`;
        this.setState({ loading: true });
        let data = await fetch(url);
        let parsedData = await data.json();
        this.setState({
            articles: parsedData.articles,
            totalResults: parsedData.totalResults,
            loading: false,
            page: this.state.page + 1
        });
    }

    fetchMoreData = async () => {
     
        const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=9dfa367e20c3460e808f9f3efa38c53d&page=${this.state.page + 1}&pageSize=${this.props.pageSize}`;
        
        let data = await fetch(url);
        let parsedData = await data.json();
        this.setState({
            articles: this.state.articles.concat(parsedData.articles),
            totalResults: parsedData.totalResults,
            page: this.state.page + 1
        });

    };

    render() {
        return (
            <>
                <div className='container' style={{ margin: '35px 0' }}>
                    <h1 className='text-center' >NewsDesk - Top Headlines </h1> <h4 style={{ textAlign: "left" }}><span className="badge bg-warning text-center">{this.capitalizeFirstLetter(this.props.category)}</span></h4>
                </div>


                <InfiniteScroll
                    dataLength={this.state.articles.length}
                    next={this.fetchMoreData}
                    hasMore={this.state.articles.length !== this.state.totalResults}
                    loader={<Spinner/>}
                >
                    <div className="container text-center">
                         {this.state.loading && <Spinner/>} 
                        <div className="row my-3">
                            {
                                this.state.articles.map((element) => {
                                    return <div key={element.url} className="col-md-4">
                                        <NewsItem title={element.title ? element.title.slice(0, 45) : " "} description={element.description ? element.description.slice(0, 88) : " "} imageUrl={element.urlToImage ? element.urlToImage : "https://images.moneycontrol.com/static-mcnews/2023/03/bse_nse_stockmarket_nifty_sensex-770x433.jpg"} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} />
                                    </div>
                                })
                            }


                        </div>
                    </div>
                </InfiniteScroll>
                {/* <div className="container d-flex justify-content-between">
                    <button type="button" disabled={this.state.page <= 1} className="btn btn-dark" onClick={this.handlePrevClick}>&larr; Previous</button>
                    <button type="button" disabled={this.state.page + 1 > this.state.totalResults / this.props.pageSize} className="btn btn-dark" onClick={this.handleNextClick}>Next &rarr;</button>
                </div> */}

            </>
        )
    }
}

export default News
