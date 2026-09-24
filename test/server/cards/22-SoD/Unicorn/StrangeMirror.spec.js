describe('Strange Mirror', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['shinjo-outrider'],
                    hand: ['strange-mirror'],
                    fate: 10
                },
                player2: {
                    inPlay: ['doji-challenger'],
                    hand: ['banzai', 'way-of-the-crane'],
                    fate: 10
                }
            });

            this.outrider = this.player1.findCardByName('shinjo-outrider');
            this.mirror = this.player1.findCardByName('strange-mirror');
            this.challenger = this.player2.findCardByName('doji-challenger');
            this.banzai = this.player2.findCardByName('banzai');
            this.wayOfTheCrane = this.player2.findCardByName('way-of-the-crane');

            this.player1.playAttachment(this.mirror, this.outrider);
            this.noMoreActions();

            this.initiateConflict({
                type: 'military',
                attackers: [this.outrider],
                defenders: [this.challenger]
            });
        });

        describe('the reaction', function () {
            it('puts an event an opponent played underneath attached character, facedown', function () {
                this.player2.clickCard(this.banzai);
                this.player2.clickCard(this.challenger);
                this.player2.clickPrompt('Done');
                this.player1.clickCard(this.mirror);

                expect(this.banzai.location).toBe(this.outrider.uuid);
                expect(this.banzai.location).toBe(this.outrider.uuid);
                expect(this.getChatLogs(5)).toContain(
                    'player1 uses Strange Mirror to put Banzai! facedown underneath Shinjo Outrider'
                );
            });

            it('does not trigger on an event you played yourself', function () {
                this.player2.pass();
                this.player1.clickCard(this.mirror);
                expect(this.player1).not.toHavePrompt('Put the event underneath attached character');
            });
        });

        describe('the action', function () {
            beforeEach(function () {
                this.player2.clickCard(this.banzai);
                this.player2.clickCard(this.challenger);
                this.player2.clickPrompt('Done');
                this.player1.clickCard(this.mirror);
                expect(this.banzai.location).toBe(this.outrider.uuid);
            });

            it('plays the event from underneath and then sacrifices the attachment', function () {
                this.player1.clickCard(this.mirror);
                this.player1.clickCard(this.banzai);
                this.player1.clickCard(this.outrider);
                this.player1.clickPrompt('Done');
                this.player1.clickPrompt('Sacrifice Strange Mirror');

                expect(this.mirror.location).toBe('conflict discard pile');
                expect(this.outrider.location).toBe('play area');
            });

            it('resolves the replayed event\'s ability', function () {
                this.player1.clickCard(this.mirror);
                this.player1.clickCard(this.banzai);
                this.player1.clickCard(this.outrider);
                this.player1.clickPrompt('Done');
                this.player1.clickPrompt('Sacrifice Strange Mirror');
                expect(this.outrider.getMilitarySkill()).toBe(this.outrider.printedMilitarySkill + 2);
            });

            it('returns the event to its owner\'s conflict discard pile', function () {
                this.player1.clickCard(this.mirror);
                this.player1.clickCard(this.banzai);
                this.player1.clickCard(this.outrider);
                this.player1.clickPrompt('Done');
                this.player1.clickPrompt('Sacrifice Strange Mirror');

                expect(this.banzai.location).toBe('conflict discard pile');
                expect(this.player2.player.conflictDiscardPile).toContain(this.banzai);
                expect(this.player1.player.conflictDiscardPile).not.toContain(this.banzai);
            });

            it('plays the event from underneath and then injures attached character', function () {
                this.outrider.fate = 1;
                this.player1.clickCard(this.mirror);
                this.player1.clickCard(this.banzai);
                this.player1.clickCard(this.outrider);
                this.player1.clickPrompt('Done');
                this.player1.clickPrompt('Injure attached character');

                expect(this.outrider.fate).toBe(0);
                expect(this.mirror.location).toBe('play area');
            });

            it('is not available when nothing is underneath attached character', function () {
                this.player1.clickCard(this.banzai);
                expect(this.player1).not.toHavePrompt('Choose an event to play');
            });
        });
    });
});
