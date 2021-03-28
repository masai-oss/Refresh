import styled from 'styled-components'


export const QuestionWrapper = styled.div`
    
    & div.boxShadow {
        box-shadow: 0px 0px 1px 1px rgb(0,0,0,0.25);
    }
    
    & div > pre{
        margin:0;
        padding: 10px 19px;
        font-family: Open Sans;
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 24px;
        letter-spacing: 0px;
        text-align: left;
    }

    & div.MuiGrid-item{
        padding: 0 19px 19px;
        /* background: red; */
    }

    & label{
        width: 100%;
    }
`

