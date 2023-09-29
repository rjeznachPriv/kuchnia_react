import './Footer.css';
import { FaCamera } from 'react-icons/fa';
import { FaAppleAlt } from 'react-icons/fa';
import { MdShelves } from 'react-icons/md';
import { MdForklift } from 'react-icons/md';
import { MdCategory } from 'react-icons/md';

import BottomButton from './BottomButton';

function Footer(props) {
    return (
        //<footer id="app-footer"> Schowki<MdShelves />, Produkty<FaAppleAlt /> <FaCamera /> zapasy<MdForklift />, kategorie<MdCategory/> </footer>
        //<footer id="app-footer"> Schowki<MdShelves />, Produkty<FaAppleAlt /> <FaCamera /> zapasy<MdForklift />, kategorie<MdCategory /> </footer>
        <footer id="app-footer">
            <BottomButton icon={<MdShelves />} caption="Schowki" />
            <BottomButton icon={<FaAppleAlt />} caption="Produkty" />
            <BottomButton icon={<FaCamera />} caption="" />
            <BottomButton icon={<MdForklift />} caption="Zapasy" />
            <BottomButton icon={<MdCategory />} caption="Kategorie" />
        </footer>
  );
}

export default Footer;
