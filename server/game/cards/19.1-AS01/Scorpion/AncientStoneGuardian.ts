import { cannotParticipateAsAttacker, cardCannot } from '../../../effects.js';
import { dishonor, draw, sequentialContext } from '../../../GameActions/GameActions.js';
import type BaseCard from '../../../BaseCard.js';
import { CardType, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import type { SequentialContextProperties } from '../../../GameActions/SequentialContextAction.js';
import type { TriggeredAbilityContext } from '../../../TriggeredAbilityContext.js';

export default class AncientStoneGuardian extends DrawCard {
    static id = 'ancient-stone-guardian';

    public setupCardAbilities() {
        this.persistentEffect({
            effect: cannotParticipateAsAttacker()
        });

        this.persistentEffect({
            effect: cardCannot({ cannot: 'applyCovert', restricts: 'opponentsCardEffects' })
        });

        this.forcedInterrupt('Dishonor a character and draw a card')
            .when({
                onCardLeavesPlay: (event, context) => event.card === context.source
            })
            .target({
                name: 'firstCharacter',
                activePromptTitle: 'Choose a character',
                cardType: CardType.Character,
                optional: true,
                hideIfNoLegalTargets: true,
                controller: (context) => (context.player.firstPlayer ? Players.Self : Players.Opponent),
                player: (context) => (context.player.firstPlayer ? Players.Self : Players.Opponent),
                cardCondition: (card, context) => this.cardCanBeChosenForDishonor(card, context)
            }, sequentialContext((context) =>
                this.dishonorAndDraw(context.targets.firstCharacter)
            ))
            .target({
                name: 'secondCharacter',
                activePromptTitle: 'Choose a character',
                cardType: CardType.Character,
                optional: true,
                hideIfNoLegalTargets: true,
                controller: (context) => (context.player.firstPlayer ? Players.Opponent : Players.Self),
                player: (context) => (context.player.firstPlayer ? Players.Opponent : Players.Self),
                cardCondition: (card, context) => this.cardCanBeChosenForDishonor(card, context)
            }, sequentialContext((context) =>
                this.dishonorAndDraw(context.targets.secondCharacter)
            ))
            .chatText('present an opportunity to sneak around {0} and find some secrets{1}{2}{3}{4}{5}{6}{7}{8}{9}{10}', (context) =>
                this.effectsForCard(context.targets.firstCharacter).concat(
                    this.effectsForCard(context.targets.secondCharacter)
                ));
    }

    private cardCanBeChosenForDishonor(card: BaseCard, context: TriggeredAbilityContext): boolean {
        return card !== context.source && dishonor({ target: card }).canAffect(card, context);
    }

    private dishonorAndDraw(target?: BaseCard | []): SequentialContextProperties {
        return {
            gameActions: target instanceof DrawCard
                ? [
                    dishonor({ target: target }),
                    draw({ target: target.controller })
                ]
                : []
        };
    }

    private effectsForCard(target?: BaseCard | []) {
        if(target instanceof DrawCard) {
            return ['. ', target.controller, ' dishonors ', target, ' to draw a card'];
        }
        return ['', '', '', '', ''];
    }
}
