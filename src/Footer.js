import './Footer.css';
import { FaCamera } from 'react-icons/fa';
import { FaAppleAlt } from 'react-icons/fa';
import { MdShelves } from 'react-icons/md';
import { MdForklift } from 'react-icons/md';
import { MdCategory } from 'react-icons/md';

import BottomButton from './BottomButton';

function Footer(props) {
    return (
        <footer id="app-footer">
            <BottomButton icon={<MdShelves />} caption="Schowki" active={props.active == 1} footerProps={ props } id='bb1' />
            <BottomButton icon={<FaAppleAlt />} caption="Produkty" active={props.active == 2} footerProps={props} id='bb2' />
            <BottomButton icon={<FaCamera />} caption="" footerProps={props} id='bb3' />
            <BottomButton icon={<MdForklift />} caption="Zapasy" active={props.active == 3} footerProps={props} id='bb4' />
            <BottomButton icon={<MdCategory />} caption="Kategorie" active={props.active == 4} footerProps={props} id='bb5' />
        </footer>
  );
}

export default Footer;
