import { CardType, Players } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class KikuMatsuri extends ProvinceCard {
    static id = 'kiku-matsuri';

    setupCardAbilities() {
        this.action({
            title: 'Honor a character home from each side',
            targets: {
                myCharacter: {
                    cardType: CardType.Character,
                    controller: Players.Self,
                    cardCondition: (card) => card.isParticipating(),
                    gameAction: AbilityDsl.actions.honor()
                },
                oppCharacter: {
                    cardType: CardType.Character,
                    controller: Players.Opponent,
                    cardCondition: (card) => card.isParticipating(),
                    gameAction: AbilityDsl.actions.honor()
                }
            },
            effect: 'honor {1} and {2}',
            effectArgs: (context) => [context.targets.myCharacter, context.targets.oppCharacter]
        });
    }
}
