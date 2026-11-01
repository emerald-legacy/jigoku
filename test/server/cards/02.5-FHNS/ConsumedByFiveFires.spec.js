describe('Consumed by Five Fires', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['adept-of-the-waves'],
                    hand: ['consumed-by-five-fires']
                },
                player2: {
                    inPlay: ['doji-challenger', 'doji-whisperer']
                }
            });
            this.challenger = this.player2.findCardByName('doji-challenger');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.challenger.fate = 3;
            this.whisperer.fate = 3;
        });

        it('says how much fate it removes from each character', function() {
            this.player1.clickCard('consumed-by-five-fires');
            this.player1.clickCard(this.challenger);
            this.player1.clickPrompt('3');
            this.player1.clickCard(this.whisperer);
            this.player1.clickPrompt('2');
            expect(this.challenger.fate).toBe(0);
            expect(this.whisperer.fate).toBe(1);
            expect(this.getChatLogs(5)).toContain('player1 chooses to: remove 3 fate from Doji Challenger and remove 2 fate from Doji Whisperer');
        });

        it('lets the player stop before 5 fate are chosen', function() {
            this.player1.clickCard('consumed-by-five-fires');
            expect(this.player1).not.toHavePromptButton('Done');
            this.player1.clickCard(this.challenger);
            this.player1.clickPrompt('1');
            expect(this.player1).toHavePromptButton('Done');
            this.player1.clickPrompt('Done');
            expect(this.challenger.fate).toBe(2);
            expect(this.whisperer.fate).toBe(3);
            expect(this.getChatLogs(5)).toContain('player1 chooses to: remove 1 fate from Doji Challenger');
            expect(this.player2).toHavePrompt('Action Window');
        });

        it('Redo discards the choices made so far and starts again', function() {
            this.player1.clickCard('consumed-by-five-fires');
            this.player1.clickCard(this.challenger);
            this.player1.clickPrompt('3');
            this.player1.clickCard(this.whisperer);
            expect(this.player1).toHavePrompt('How much fate do you want to remove?');
            this.player1.clickPrompt('Redo');
            expect(this.player1).toBeAbleToSelect(this.challenger);
            expect(this.player1).toBeAbleToSelect(this.whisperer);
            expect(this.player1).not.toHavePromptButton('Done');
            this.player1.clickCard(this.whisperer);
            this.player1.clickPrompt('2');
            this.player1.clickPrompt('Done');
            expect(this.challenger.fate).toBe(3);
            expect(this.whisperer.fate).toBe(1);
            expect(this.getChatLogs(5)).toContain('player1 chooses to: remove 2 fate from Doji Whisperer');
        });
    });
});

describe('Consumed by Five Fires without a Shugenja in play', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    fate: 10,
                    inPlay: ['akodo-gunso'],
                    hand: ['consumed-by-five-fires'],
                    dynastyDiscard: ['agasha-swordsmith']
                },
                player2: {
                    inPlay: ['doji-challenger', 'isawa-kaede']
                }
            });
            this.consumed = this.player1.findCardByName('consumed-by-five-fires');
            this.swordsmith = this.player1.placeCardInProvince('agasha-swordsmith', 'province 1');
            this.swordsmith.facedown = false;
            this.challenger = this.player2.findCardByName('doji-challenger');
            this.challenger.fate = 3;
        });

        it('cannot be played when your only Shugenja is not in play (ruling #239)', function() {
            expect(this.swordsmith.location).toBe('province 1');
            expect(this.swordsmith.hasTrait('shugenja')).toBe(true);
            this.player1.clickCard(this.consumed);
            expect(this.consumed.location).toBe('hand');
            expect(this.player1.fate).toBe(10);
            expect(this.challenger.fate).toBe(3);
            expect(this.player1).toHavePrompt('Action Window');
        });
    });
});
