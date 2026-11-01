describe('Utaku Yumino', function() {
    integration(function() {
        describe('with cards in hand', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['utaku-yumino', 'doji-whisperer'],
                        hand: ['fine-katana', 'ornate-fan', 'banzai']
                    },
                    player2: {
                        inPlay: ['shiba-peacemaker', 'matsu-berserker']
                    }
                });
                this.yumino = this.player1.findCardByName('utaku-yumino');
                this.whisperer = this.player1.findCardByName('doji-whisperer');
                this.katana = this.player1.findCardByName('fine-katana');
                this.fan = this.player1.findCardByName('ornate-fan');
                this.peacemaker = this.player2.findCardByName('shiba-peacemaker');
                this.berserker = this.player2.findCardByName('matsu-berserker');
            });

            it('discards a card from hand to give itself +2 military and +2 political', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.yumino],
                    defenders: [this.peacemaker]
                });
                this.player2.pass();
                this.player1.clickCard(this.yumino);
                expect(this.player1).toHavePrompt('Select card to discard');
                this.player1.clickCard(this.katana);
                expect(this.katana.location).toBe('conflict discard pile');
                expect(this.player1.hand.length).toBe(2);
                expect(this.yumino.militarySkill).toBe(4);
                expect(this.yumino.politicalSkill).toBe(4);
            });

            it('can be used during a conflict it is not participating in', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.whisperer],
                    defenders: [this.peacemaker]
                });
                this.player2.pass();
                expect(this.yumino.isParticipating()).toBe(false);
                this.player1.clickCard(this.yumino);
                this.player1.clickCard(this.katana);
                expect(this.katana.location).toBe('conflict discard pile');
                expect(this.yumino.militarySkill).toBe(4);
                expect(this.yumino.politicalSkill).toBe(4);
            });

            it('can be used only once per conflict', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.yumino],
                    defenders: [this.peacemaker]
                });
                this.player2.pass();
                this.player1.clickCard(this.yumino);
                this.player1.clickCard(this.katana);
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.yumino);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.player1.hand.length).toBe(2);
                expect(this.fan.location).toBe('hand');
                expect(this.yumino.militarySkill).toBe(4);
            });

            it('ends the bonus with the conflict and can be used again in a later conflict', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.whisperer],
                    defenders: [this.peacemaker]
                });
                this.player2.pass();
                this.player1.clickCard(this.yumino);
                this.player1.clickCard(this.katana);
                expect(this.yumino.militarySkill).toBe(4);
                this.noMoreActions();
                expect(this.getChatLogs(5)).toContain('player2 won a military conflict 4 vs 0');
                expect(this.yumino.militarySkill).toBe(2);
                expect(this.yumino.politicalSkill).toBe(2);

                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.berserker],
                    defenders: [],
                    ring: 'fire'
                });
                this.player1.clickCard(this.yumino);
                expect(this.player1).toHavePrompt('Select card to discard');
                this.player1.clickCard(this.fan);
                expect(this.fan.location).toBe('conflict discard pile');
                expect(this.yumino.militarySkill).toBe(4);
                expect(this.yumino.politicalSkill).toBe(4);
            });

            it('cannot be used outside a conflict', function() {
                expect(this.player1).toHavePrompt('Action Window');
                this.player1.clickCard(this.yumino);
                expect(this.player1).toHavePrompt('Action Window');
                expect(this.player1.hand.length).toBe(3);
                expect(this.yumino.militarySkill).toBe(2);
            });
        });

        describe('with an empty hand', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['utaku-yumino']
                    },
                    player2: {
                        inPlay: ['shiba-peacemaker']
                    }
                });
                this.yumino = this.player1.findCardByName('utaku-yumino');
                this.peacemaker = this.player2.findCardByName('shiba-peacemaker');
            });

            it('cannot be used without a card to discard', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.yumino],
                    defenders: [this.peacemaker]
                });
                this.player2.pass();
                expect(this.player1.hand.length).toBe(0);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.yumino);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.yumino.militarySkill).toBe(2);
            });
        });
    });
});
