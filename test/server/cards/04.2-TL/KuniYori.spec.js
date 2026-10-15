describe('Kuni Yori', function() {
    integration(function() {
        describe('', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['kuni-yori', 'borderlands-defender','vanguard-warrior'],
                        hand: ['way-of-the-crab']
                    },
                    player2: {
                        inPlay: ['doji-whisperer'],
                        hand: ['banzai', 'banzai', 'banzai']
                    }
                });
                this.kuniYori = this.player1.findCardByName('kuni-yori');
                this.borderlandsDefender = this.player1.findCardByName('borderlands-defender');
                this.vanguardWarrior = this.player1.findCardByName('vanguard-warrior');
                this.dojiWhisperer = this.player2.findCardByName('doji-whisperer');
            });

            describe('Kuni Yori\'s constant ability', function() {
                it('should have no effect outside of earth conflicts', function() {
                    expect(this.kuniYori.militarySkill).toBe(4);
                    expect(this.kuniYori.politicalSkill).toBe(4);
                    expect(this.borderlandsDefender.militarySkill).toBe(3);
                    expect(this.borderlandsDefender.politicalSkill).toBe(3);
                    expect(this.vanguardWarrior.militarySkill).toBe(2);
                    expect(this.vanguardWarrior.politicalSkill).toBe(1);
                    expect(this.dojiWhisperer.militarySkill).toBe(0);
                    expect(this.dojiWhisperer.politicalSkill).toBe(3);
                    this.noMoreActions();
                    this.initiateConflict({
                        attackers: [this.kuniYori, this.borderlandsDefender],
                        defenders: [],
                        ring: 'air'
                    });
                    expect(this.kuniYori.militarySkill).toBe(4);
                    expect(this.kuniYori.politicalSkill).toBe(4);
                    expect(this.borderlandsDefender.militarySkill).toBe(3);
                    expect(this.borderlandsDefender.politicalSkill).toBe(3);
                    expect(this.vanguardWarrior.militarySkill).toBe(2);
                    expect(this.vanguardWarrior.politicalSkill).toBe(1);
                    expect(this.dojiWhisperer.militarySkill).toBe(0);
                    expect(this.dojiWhisperer.politicalSkill).toBe(3);
                });

                it('should give +1/+1 to all characters you control', function() {
                    this.noMoreActions();
                    this.initiateConflict({
                        attackers: [this.kuniYori, this.borderlandsDefender],
                        defenders: [],
                        ring: 'earth'
                    });
                    expect(this.kuniYori.militarySkill).toBe(5);
                    expect(this.kuniYori.politicalSkill).toBe(5);
                    expect(this.borderlandsDefender.militarySkill).toBe(4);
                    expect(this.borderlandsDefender.politicalSkill).toBe(4);
                    expect(this.vanguardWarrior.militarySkill).toBe(3);
                    expect(this.vanguardWarrior.politicalSkill).toBe(2);
                    expect(this.dojiWhisperer.militarySkill).toBe(0);
                    expect(this.dojiWhisperer.politicalSkill).toBe(3);
                });
            });

            describe('Kuni Yori\'s triggered ability', function() {
                it('should not trigger outside of a conflict', function() {
                    expect(this.player1).toHavePrompt('Action Window');
                    this.player1.clickCard(this.kuniYori);
                    expect(this.player1).toHavePrompt('Action Window');
                });

                describe('during a conflict', function() {
                    beforeEach(function() {
                        this.noMoreActions();
                        this.initiateConflict({
                            attackers: [this.kuniYori, this.borderlandsDefender],
                            defenders: []
                        });
                        this.player2.pass();
                    });

                    it('should prompt to choose a player', function() {
                        this.player1.clickCard(this.kuniYori);
                        expect(this.player1).toHavePrompt('Select a player to discard a random card from his/her hand');
                        expect(this.player1).toHavePromptButton('player1');
                        expect(this.player1).toHavePromptButton('player2');
                    });

                    it('should cost 1 honor', function() {
                        const honor = this.player1.player.honor;
                        this.player1.clickCard(this.kuniYori);
                        this.player1.clickPrompt('player2');
                        expect(this.player1.player.honor).toBe(honor - 1);
                    });

                    it('should discard 1 card at random from the chosen player\'s hand', function() {
                        const handSize = this.player2.player.hand.length;
                        this.player1.clickCard(this.kuniYori);
                        this.player1.clickPrompt('player2');
                        expect(this.player2.player.hand.length).toBe(handSize - 1);
                    });
                });
            });
        });
    });
});
