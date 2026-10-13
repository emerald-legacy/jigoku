import { Element } from '../../Constants.js';
import { honor } from '../../GameActions/GameActions.js';
import { makeMantra } from '../makeMantra.js';

export default makeMantra('mantra-of-air', Element.Air, 'Honor a monk and draw a card', honor(), 'honor {0} and draw a card');
