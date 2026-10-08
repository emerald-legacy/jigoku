import { CardType, Players } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import { honor } from '../../GameActions/GameActions.js';
import { msg } from '../../GameChat.js';

export default class KikuMatsuri extends ProvinceCard {
    static id = 'kiku-matsuri';

    setupCardAbilities() {
        this.action('Honor a character home from each side')
            .target({
                name: 'myCharacter',
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card) => card.isParticipating()
            }, honor())
            .target({
                name: 'oppCharacter',
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card) => card.isParticipating()
            }, honor())
            .chatText((context) => msg`honor ${context.targets.myCharacter} and ${context.targets.oppCharacter}`);
    }
}
