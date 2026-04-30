import DrawCard from '../../drawcard';
import { CardTypes } from '../../Constants';

class EmbraceTheVoid extends DrawCard {
    static id = 'embrace-the-void';

    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Take Fate',
            when: {
                onMoveFate: (event, context) =>
                    event.origin === context.source.parent && event.fate > 0 && event.recipient !== context.player
            },
            effect: 'take the {1} fate being removed from {2}',
            effectArgs: context => [context.event.fate, context.source.parent],
            handler: context => context.event.recipient = context.player
        });
    }

    canPlay(context, playType) {
        if(!context.player.cardsInPlay.some(card => card.getType() === CardTypes.Character && card.hasTrait('shugenja'))) {
            return false;
        }

        return super.canPlay(context, playType);
    }
}


export default EmbraceTheVoid;
