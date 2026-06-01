import DrawCard from '../../DrawCard.js';
import type BaseCard from '../../BaseCard.js';
import type { AbilityContext } from '../../AbilityContext.js';
import { Locations, Players, TargetModes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class IkomaMessageRunner extends DrawCard {
    static id = 'ikoma-message-runner';

    setupCardAbilities() {
        this.action({
            title: 'Flip a card faceup',
            targets: {
                myCard: {
                    activePromptTitle: 'Choose a facedown card in your provinces',
                    location: Locations.Provinces,
                    mode: TargetModes.UpTo,
                    numCards: 1,
                    optional: true,
                    controller: Players.Self,
                    cardCondition: card => card.isDynasty && card.isFacedown(),
                    gameAction: AbilityDsl.actions.flipDynasty()
                },
                opponentsCard: {
                    activePromptTitle: 'Choose a facedown card in opponents provinces',
                    location: Locations.Provinces,
                    controller: Players.Opponent,
                    mode: TargetModes.UpTo,
                    numCards: 1,
                    optional: true,
                    cardCondition: card => card.isDynasty && card.isFacedown(),
                    gameAction: AbilityDsl.actions.flipDynasty()
                }
            },
            effect: 'reveal up to 1 facedown card in each player\'s provinces.{1}',
            effectArgs: context => [this.buildString(context)]
        });
    }

    buildString(context: AbilityContext) {
        let string = '';

        if(context.targets.myCard && (context.targets.myCard as BaseCard[]).length) {
            const myCard = (context.targets.myCard as BaseCard[])[0];
            string = string.concat(` ${myCard.name} is revealed in ${myCard.controller.name}'s ${myCard.location}.`);
        }

        if(context.targets.opponentsCard && (context.targets.opponentsCard as BaseCard[]).length) {
            const opponentCard = (context.targets.opponentsCard as BaseCard[])[0];
            string = string.concat(` ${opponentCard.name} is revealed in ${opponentCard.controller.name}'s ${opponentCard.location}.`);
        }
        return string;
    }
}


export default IkomaMessageRunner;
