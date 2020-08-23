import styled from 'styled-components'

const LinkWrapper = styled.a`
  display: inline-flex;
  align-items: center;

  &:hover {
    color: #0088cc;
    opacity: 1;
    img.link {
      display: none;
    }
    img.link-highlight {
      display: inline-block;
    }
  }
  opacity: 0.56;
  font-size: 13px;
  color: #000000;
  letter-spacing: 0.2px;
  text-align: right;
  line-height: 18px;
  text-decoration: none;
  img {
    margin-left: 6px;
    width: 12px !important;
    height: 12px !important;
  }
  img.link-highlight {
    display: none;
  }
`

export default LinkWrapper
