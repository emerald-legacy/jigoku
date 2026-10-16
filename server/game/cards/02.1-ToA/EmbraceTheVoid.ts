import DrawCard from '../../DrawCard.js';
import { controlsShugenja } from '../controlsShugenja.js';
import { msg } from '../../GameChat.js';

class EmbraceTheVoid extends DrawCard {
    static id = 'embrace-the-void';

    override setupCardAbilities() {
        this.playOnlyIf((context) => controlsShugenja(context.player));

        this.wouldInterrupt('Take Fate')
            .when({
                onMoveFate: (event, context) =>
                    event.origin === context.source.parentCharacter && (event.fate ?? 0) > 0 && event.recipient !== context.player
            })
            .handler((context) => {
                context.event.recipient = context.player;
            })
            .chatText((context) => msg`take the ${context.event.fate} fate being removed from ${context.source.parentCharacter}`);
    }
}


export default EmbraceTheVoid;
