import { CardType, Players } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class KikuMatsuri extends ProvinceCard {
    static id = 'kiku-matsuri';

    setupCardAbilities() {
        this.action('Honor a character home from each side')
            .target('myCharacter', {
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card) => card.isParticipating()
            }, AbilityDsl.actions.honor())
            .target('oppCharacter', {
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card) => card.isParticipating()
            }, AbilityDsl.actions.honor())
            .effect('honor {1} and {2}', (context) => [context.targets.myCharacter, context.targets.oppCharacter]);
    }
}
