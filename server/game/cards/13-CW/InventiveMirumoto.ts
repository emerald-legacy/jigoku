import DrawCard from '../../DrawCard.js';
import { Location, CardType, Players, Element } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

const elementKey = 'inventive-mirumoto-water';

class InventiveMirumoto extends DrawCard {
    static id = 'inventive-mirumoto';

    setupCardAbilities() {
        this.action<DrawCard>({
            title: 'Play attachment onto this character',
            condition: context => context.game.rings[this.getCurrentElementSymbol(elementKey)].isConsideredClaimed(context.player),
            target: {
                cardCondition: card => card.type === CardType.Attachment,
                location: Location.ConflictDiscardPile,
                controller: Players.Self,
                gameAction: AbilityDsl.actions.playCard<DrawCard>(context => ({
                    payCosts: true,
                    source: this,
                    playCardTarget: attachContext => {
                        attachContext.target = context.source;
                        attachContext.targets.target = context.source;
                    }

                }))
            },
            effect: 'play {0} onto {1}',
            effectArgs: context => [context.target ?? '', context.source]
        });
    }

    getPrintedElementSymbols() {
        let symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKey,
            prettyName: 'Claimed Ring',
            element: Element.Water
        });
        return symbols;
    }
}


export default InventiveMirumoto;
